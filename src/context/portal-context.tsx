'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member, Application, ActivityLog, NotificationItem, ClubSettings, UserRole } from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  DEFAULT_CLUB_SETTINGS,
} from '@/lib/constants';
import { calculateProfileCompletion, generateSuggestedMemberId } from '@/lib/utils';
import { message } from 'antd';

interface PortalContextType {
  currentUser: Member | null;
  currentRole: UserRole | 'GUEST';
  members: Member[];
  applications: Application[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  clubSettings: ClubSettings;
  setCurrentUserRole: (role: UserRole | 'GUEST') => void;
  login: (identifier: string, role?: UserRole) => boolean;
  logout: () => void;
  submitApplication: (data: Omit<Application, 'id' | 'status' | 'appliedDate'>) => Application;
  approveApplication: (
    applicationId: string,
    approvalData: {
      fromNo: string;
      memberId: string;
      admissionDate: string;
      userId: string;
      initialPassword?: string;
      status?: Member['status'];
    }
  ) => void;
  rejectApplication: (applicationId: string, reason: string) => void;
  updateMemberProfile: (memberId: string, updatedFields: Partial<Member>) => void;
  importMembersList: (importedData: Partial<Member>[]) => { added: number; duplicates: number };
  addActivityLog: (action: string, memberId?: string, details?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateClubSettings: (settings: Partial<ClubSettings>) => void;
  switchDemoUser: (target: 'MEMBER' | 'ADMIN') => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kpns_members');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_MEMBERS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kpns_applications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kpns_notifications');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kpns_logs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  const [clubSettings, setClubSettings] = useState<ClubSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kpns_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_CLUB_SETTINGS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole | 'GUEST'>('MEMBER');
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    return INITIAL_MEMBERS[0]; // Default to Pintu Patra
  });

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpns_members', JSON.stringify(members));
      localStorage.setItem('kpns_applications', JSON.stringify(applications));
      localStorage.setItem('kpns_notifications', JSON.stringify(notifications));
      localStorage.setItem('kpns_logs', JSON.stringify(activityLogs));
      localStorage.setItem('kpns_settings', JSON.stringify(clubSettings));
    }
  }, [members, applications, notifications, activityLogs, clubSettings]);

  const addActivityLog = (action: string, memberId?: string, details?: string) => {
    const userDisplay = currentUser?.userId || (currentRole === 'ADMIN' ? 'ADMIN' : 'SYSTEM');
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: dateStr,
      user: userDisplay,
      role: currentRole === 'ADMIN' ? 'Admin' : 'Member',
      action,
      memberId,
      details,
    };

    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const login = (identifier: string, role: UserRole = 'MEMBER'): boolean => {
    const clean = identifier.trim().toLowerCase();
    const found = members.find(
      (m) =>
        m.userId.toLowerCase() === clean ||
        m.email.toLowerCase() === clean ||
        m.memberId.toLowerCase() === clean ||
        m.whatsapp === clean
    );

    if (found) {
      setCurrentUser(found);
      setCurrentRole(found.role);
      addActivityLog('User Logged In', found.memberId, `Logged in with ${identifier}`);
      return true;
    }

    if (role === 'ADMIN' || clean.includes('admin')) {
      const adminUser = members.find((m) => m.role === 'ADMIN') || members[1];
      setCurrentUser(adminUser);
      setCurrentRole('ADMIN');
      addActivityLog('Admin Logged In', adminUser?.memberId, 'Admin portal access');
      return true;
    }

    // Allow mock fallback login for user test
    if (members.length > 0) {
      setCurrentUser(members[0]);
      setCurrentRole(role);
      return true;
    }

    return false;
  };

  const logout = () => {
    addActivityLog('User Logged Out', currentUser?.memberId);
    setCurrentUser(null);
    setCurrentRole('GUEST');
  };

  const switchDemoUser = (target: 'MEMBER' | 'ADMIN') => {
    if (target === 'ADMIN') {
      const admin = members.find((m) => m.role === 'ADMIN') || members[1];
      setCurrentUser(admin);
      setCurrentRole('ADMIN');
      message.info('Switched to Admin Mode (Arup Maiti)');
    } else {
      const member = members.find((m) => m.role === 'MEMBER') || members[0];
      setCurrentUser(member);
      setCurrentRole('MEMBER');
      message.info('Switched to Member Mode (Pintu Patra)');
    }
  };

  const submitApplication = (
    data: Omit<Application, 'id' | 'status' | 'appliedDate'>
  ): Application => {
    const nextSeq = applications.length + 1;
    const year = new Date().getFullYear();
    const id = `KPNS-APP-${year}-${String(nextSeq).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newApp: Application = {
      ...data,
      id,
      status: 'PENDING',
      appliedDate: today,
    };

    setApplications((prev) => [newApp, ...prev]);

    addActivityLog(
      `Submitted Application ${id}`,
      undefined,
      `New membership application from ${data.name} (${data.whatsapp})`
    );

    // Add notification for admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Member Application',
      description: `${data.name} applied for membership (${id})`,
      date: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newApp;
  };

  const approveApplication = (
    applicationId: string,
    approvalData: {
      fromNo: string;
      memberId: string;
      admissionDate: string;
      userId: string;
      initialPassword?: string;
      status?: Member['status'];
    }
  ) => {
    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) return;

    // 1. Update application status
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'APPROVED',
              fromNo: approvalData.fromNo,
              memberId: approvalData.memberId,
              admissionDate: approvalData.admissionDate,
              userId: approvalData.userId,
              reviewedBy: currentUser?.name || 'ADMIN',
              reviewedAt: new Date().toISOString(),
            }
          : app
      )
    );

    // 2. Create new active member
    const { score, missingFields } = calculateProfileCompletion({
      ...targetApp,
      ...approvalData,
      status: (approvalData.status || 'ACTIVE') as Member['status'],
    });

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      memberId: approvalData.memberId,
      fromNo: approvalData.fromNo,
      userId: approvalData.userId,
      role: 'MEMBER',
      status: approvalData.status || 'ACTIVE',
      admissionDate: approvalData.admissionDate,
      name: targetApp.name,
      fatherName: targetApp.fatherName,
      whatsapp: targetApp.whatsapp,
      altMobile: targetApp.altMobile,
      email: targetApp.email,
      aadhaar: targetApp.aadhaar,
      bloodGroup: targetApp.bloodGroup,
      dob: targetApp.dob,
      houseNumber: targetApp.houseNumber,
      villageTown: targetApp.villageTown,
      postOffice: targetApp.postOffice,
      policeStation: targetApp.policeStation,
      city: targetApp.city,
      state: targetApp.state,
      country: targetApp.country,
      pincode: targetApp.pincode,
      profileCompletion: score,
      missingFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMembers((prev) => [newMember, ...prev]);

    addActivityLog(
      `Approved ${applicationId}`,
      approvalData.memberId,
      `Assigned Member ID: ${approvalData.memberId}, Form No: ${approvalData.fromNo}`
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Membership Approved',
      description: `Application ${applicationId} for ${targetApp.name} was approved.`,
      date: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const rejectApplication = (applicationId: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'REJECTED',
              rejectionReason: reason,
              reviewedBy: currentUser?.name || 'ADMIN',
              reviewedAt: new Date().toISOString(),
            }
          : app
      )
    );

    addActivityLog(`Rejected ${applicationId}`, undefined, `Reason: ${reason}`);
  };

  const updateMemberProfile = (memberId: string, updatedFields: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.memberId === memberId || m.id === memberId) {
          const merged = { ...m, ...updatedFields, updatedAt: new Date().toISOString() };
          const { score, missingFields } = calculateProfileCompletion(merged);
          const updated: Member = {
            ...merged,
            profileCompletion: score,
            missingFields,
          };
          if (currentUser && (currentUser.memberId === memberId || currentUser.id === memberId)) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return m;
      })
    );

    addActivityLog(`Updated profile`, memberId, `Profile details updated`);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Profile Updated',
      description: 'Your profile changes have been saved successfully.',
      date: 'Just now',
      read: false,
      type: 'info',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const importMembersList = (
    importedData: Partial<Member>[]
  ): { added: number; duplicates: number } => {
    let addedCount = 0;
    let duplicateCount = 0;
    const newMemberList = [...members];

    importedData.forEach((item, index) => {
      // Check duplicate by mobile or email or memberId
      const isDuplicate = newMemberList.some(
        (m) =>
          (item.whatsapp && m.whatsapp === item.whatsapp) ||
          (item.email && m.email.toLowerCase() === item.email.toLowerCase()) ||
          (item.memberId && m.memberId.toLowerCase() === item.memberId.toLowerCase())
      );

      if (isDuplicate) {
        duplicateCount++;
        return;
      }

      const seq = newMemberList.length + 1;
      const { memberId, userId } = generateSuggestedMemberId(
        item.fromNo || String(seq),
        item.name || 'Member'
      );

      const computed = calculateProfileCompletion(item);

      const newMember: Member = {
        id: `mem-import-${Date.now()}-${index}`,
        memberId: item.memberId || memberId,
        fromNo: item.fromNo || String(seq),
        userId: item.userId || userId,
        role: 'MEMBER',
        status: item.status || 'ACTIVE',
        admissionDate: item.admissionDate || new Date().toISOString().split('T')[0],
        name: item.name || 'Member Name',
        fatherName: item.fatherName || '',
        whatsapp: item.whatsapp || '',
        altMobile: item.altMobile || '',
        email: item.email || '',
        aadhaar: item.aadhaar || '',
        bloodGroup: item.bloodGroup || 'O+',
        dob: item.dob || '1990-01-01',
        houseNumber: item.houseNumber || '',
        villageTown: item.villageTown || 'Khejurdaha',
        postOffice: item.postOffice || '',
        policeStation: item.policeStation || '',
        city: item.city || '',
        state: item.state || 'West Bengal',
        country: item.country || 'India',
        pincode: item.pincode || '721401',
        profileCompletion: computed.score,
        missingFields: computed.missingFields,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      newMemberList.push(newMember);
      addedCount++;
    });

    setMembers(newMemberList);
    addActivityLog(
      `Imported ${addedCount} members`,
      undefined,
      `CSV/Excel batch import completed (${duplicateCount} duplicates skipped)`
    );

    return { added: addedCount, duplicates: duplicateCount };
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateClubSettings = (newSettings: Partial<ClubSettings>) => {
    setClubSettings((prev) => ({ ...prev, ...newSettings }));
    addActivityLog(`Updated club settings`, undefined, 'General club info updated');
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        currentRole,
        members,
        applications,
        notifications,
        activityLogs,
        clubSettings,
        setCurrentUserRole: (role) => setCurrentRole(role),
        login,
        logout,
        submitApplication,
        approveApplication,
        rejectApplication,
        updateMemberProfile,
        importMembersList,
        addActivityLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateClubSettings,
        switchDemoUser,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
