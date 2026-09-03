'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Member, Application, ActivityLog, NotificationItem, ClubSettings, UserRole } from '@/types';
import {
  INITIAL_MEMBERS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITY_LOGS,
  DEFAULT_CLUB_SETTINGS,
} from '@/lib/constants';
import { calculateProfileCompletion, generateSuggestedMemberId } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { message } from 'antd';

interface PortalContextType {
  currentUser: Member | null;
  currentRole: UserRole | 'GUEST';
  members: Member[];
  applications: Application[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  clubSettings: ClubSettings;
  isLoading: boolean;
  refreshData: () => Promise<void>;
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
  assignCommitteeRole: (memberId: string, role: string | null) => void;
  importMembersList: (importedData: Partial<Member>[]) => { added: number; duplicates: number };
  addActivityLog: (action: string, memberId?: string, details?: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateClubSettings: (settings: Partial<ClubSettings>) => void;
  switchDemoUser: (target: 'MEMBER' | 'ADMIN') => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  // Supabase Fetch Function
  const loadFromSupabase = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Members
      const { data: dbMembers, error: mErr } = await supabase
        .from('members')
        .select('*')
        .order('admission_date', { ascending: false });

      if (!mErr && dbMembers && dbMembers.length > 0) {
        const mapped: Member[] = dbMembers.map((m: any) => ({
          id: m.id,
          memberId: m.member_id,
          fromNo: m.from_no,
          userId: m.user_id,
          role: m.role || 'MEMBER',
          status: m.status || 'ACTIVE',
          admissionDate: m.admission_date,
          avatarUrl: m.avatar_url,
          name: m.name,
          fatherName: m.father_name,
          whatsapp: m.whatsapp,
          altMobile: m.alt_mobile,
          email: m.email,
          aadhaar: m.aadhaar,
          bloodGroup: m.blood_group,
          dob: m.dob,
          houseNumber: m.house_number,
          villageTown: m.village_town,
          postOffice: m.post_office,
          policeStation: m.police_station,
          city: m.city,
          district: m.district || 'Purba Medinipur',
          state: m.state || 'West Bengal',
          country: m.country || 'India',
          pincode: m.pincode,
          profileCompletion: m.profile_completion || 85,
          missingFields: [],
          committeeRole: m.committee_role || undefined,
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        }));
        setMembers(mapped);

        // Keep current user updated
        setCurrentUser((prev) => {
          if (!prev) return mapped[0];
          const matched = mapped.find((m) => m.memberId === prev.memberId || m.id === prev.id);
          return matched || mapped[0];
        });
      }

      // 2. Fetch Applications
      const { data: dbApps, error: aErr } = await supabase
        .from('applications')
        .select('*')
        .order('applied_date', { ascending: false });

      if (!aErr && dbApps && dbApps.length > 0) {
        const mappedApps: Application[] = dbApps.map((a: any) => ({
          id: a.id,
          status: a.status,
          appliedDate: a.applied_date,
          name: a.name,
          fatherName: a.father_name,
          whatsapp: a.whatsapp,
          altMobile: a.alt_mobile,
          email: a.email,
          aadhaar: a.aadhaar,
          bloodGroup: a.blood_group,
          dob: a.dob,
          houseNumber: a.house_number,
          villageTown: a.village_town,
          postOffice: a.post_office,
          policeStation: a.police_station,
          city: a.city,
          district: a.district || 'Purba Medinipur',
          state: a.state || 'West Bengal',
          country: a.country || 'India',
          pincode: a.pincode,
          fromNo: a.from_no,
          memberId: a.member_id,
          admissionDate: a.admission_date,
          userId: a.user_id,
          rejectionReason: a.rejection_reason,
          reviewedBy: a.reviewed_by,
          reviewedAt: a.reviewed_at,
        }));
        setApplications(mappedApps);
      }

      // 3. Fetch Activity Logs
      const { data: dbLogs, error: lErr } = await supabase
        .from('activity_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (!lErr && dbLogs && dbLogs.length > 0) {
        const mappedLogs: ActivityLog[] = dbLogs.map((l: any) => ({
          id: l.id,
          timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString('en-IN') : '',
          user: l.user_name || 'SYSTEM',
          role: l.role || 'Admin',
          action: l.action,
          memberId: l.member_id,
          details: l.details,
        }));
        setActivityLogs(mappedLogs);
      }

      // 4. Fetch Notifications
      const { data: dbNotifs, error: nErr } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!nErr && dbNotifs && dbNotifs.length > 0) {
        const mappedNotifs: NotificationItem[] = dbNotifs.map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.description,
          date: n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent',
          read: n.read ?? false,
          type: n.type || 'info',
        }));
        setNotifications(mappedNotifs);
      }

      // 5. Fetch Club Settings
      const { data: dbSettings, error: sErr } = await supabase
        .from('club_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!sErr && dbSettings) {
        setClubSettings({
          clubNameBengali: dbSettings.club_name_bengali || DEFAULT_CLUB_SETTINGS.clubNameBengali,
          clubNameEnglish: dbSettings.club_name_english || DEFAULT_CLUB_SETTINGS.clubNameEnglish,
          tagline: dbSettings.tagline || DEFAULT_CLUB_SETTINGS.tagline,
          contactEmail: dbSettings.contact_email || DEFAULT_CLUB_SETTINGS.contactEmail,
          contactPhone: dbSettings.contact_phone || DEFAULT_CLUB_SETTINGS.contactPhone,
          address: dbSettings.address || DEFAULT_CLUB_SETTINGS.address,
          logoUrl: dbSettings.logo_url || DEFAULT_CLUB_SETTINGS.logoUrl,
          registrationOpen: dbSettings.registration_open ?? true,
          autoGenerateMemberId: dbSettings.auto_generate_member_id ?? true,
          memberIdPrefix: dbSettings.member_id_prefix || 'KPNS',
        });
      }
    } catch (err) {
      console.warn('Supabase fetch encountered an issue, using local cache:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFromSupabase();
  }, [loadFromSupabase]);

  // Sync to localStorage as resilient offline backup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kpns_members', JSON.stringify(members));
      localStorage.setItem('kpns_applications', JSON.stringify(applications));
      localStorage.setItem('kpns_notifications', JSON.stringify(notifications));
      localStorage.setItem('kpns_logs', JSON.stringify(activityLogs));
      localStorage.setItem('kpns_settings', JSON.stringify(clubSettings));
    }
  }, [members, applications, notifications, activityLogs, clubSettings]);

  const addActivityLog = async (action: string, memberId?: string, details?: string) => {
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

    try {
      await supabase.from('activity_logs').insert([
        {
          user_name: userDisplay,
          role: currentRole === 'ADMIN' ? 'Admin' : 'Member',
          action,
          member_id: memberId,
          details,
        },
      ]);
    } catch (err) {
      console.warn('Supabase log insert bypassed:', err);
    }
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
      const adminUser = members.find((m) => m.role === 'ADMIN') || members[1] || INITIAL_MEMBERS[1];
      setCurrentUser(adminUser);
      setCurrentRole('ADMIN');
      addActivityLog('Admin Demo Login', adminUser?.memberId, `Logged in as Admin`);
      return true;
    }

    const defaultMember = members[0] || INITIAL_MEMBERS[0];
    setCurrentUser(defaultMember);
    setCurrentRole('MEMBER');
    addActivityLog('Member Demo Login', defaultMember?.memberId, `Logged in as Member`);
    return true;
  };

  const logout = () => {
    addActivityLog('User Logged Out', currentUser?.memberId);
    setCurrentRole('GUEST');
    setCurrentUser(null);
  };

  const switchDemoUser = (target: 'MEMBER' | 'ADMIN') => {
    if (target === 'ADMIN') {
      const admin = members.find((m) => m.role === 'ADMIN') || members[1] || INITIAL_MEMBERS[1];
      setCurrentUser(admin);
      setCurrentRole('ADMIN');
      message.info('Switched to Admin Mode (Arup Maiti)');
    } else {
      const member = members.find((m) => m.role === 'MEMBER') || members[0] || INITIAL_MEMBERS[0];
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

    // Async push to Supabase
    (async () => {
      try {
        const { error } = await supabase.from('applications').insert([
          {
            id: newApp.id,
            status: 'PENDING',
            applied_date: newApp.appliedDate,
            name: newApp.name,
            father_name: newApp.fatherName,
            whatsapp: newApp.whatsapp,
            alt_mobile: newApp.altMobile,
            email: newApp.email,
            aadhaar: newApp.aadhaar,
            blood_group: newApp.bloodGroup,
            dob: newApp.dob,
            house_number: newApp.houseNumber,
            village_town: newApp.villageTown,
            post_office: newApp.postOffice,
            police_station: newApp.policeStation,
            city: newApp.city,
            district: newApp.district || 'Purba Medinipur',
            state: newApp.state || 'West Bengal',
            country: newApp.country || 'India',
            pincode: newApp.pincode,
          },
        ]);
        if (error) {
          console.warn('Supabase application sync error:', error);
        }
      } catch (err) {
        console.warn('Supabase application sync bypassed:', err);
      }
    })();

    addActivityLog(
      `Submitted Application ${id}`,
      undefined,
      `New membership application from ${data.name} (${data.whatsapp})`
    );

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
      district: targetApp.district || 'Purba Medinipur',
      state: targetApp.state || 'West Bengal',
      country: targetApp.country || 'India',
      pincode: targetApp.pincode,
      profileCompletion: score,
      missingFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMembers((prev) => [newMember, ...prev]);

    // Sync to Supabase
    (async () => {
      try {
        await supabase
          .from('applications')
          .update({
            status: 'APPROVED',
            from_no: approvalData.fromNo,
            member_id: approvalData.memberId,
            admission_date: approvalData.admissionDate,
            user_id: approvalData.userId,
            reviewed_by: currentUser?.name || 'ADMIN',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', applicationId);

        await supabase.from('members').insert([
          {
            member_id: newMember.memberId,
            from_no: newMember.fromNo,
            user_id: newMember.userId,
            role: newMember.role,
            status: newMember.status,
            admission_date: newMember.admissionDate,
            name: newMember.name,
            father_name: newMember.fatherName,
            whatsapp: newMember.whatsapp,
            alt_mobile: newMember.altMobile,
            email: newMember.email,
            aadhaar: newMember.aadhaar,
            blood_group: newMember.bloodGroup,
            dob: newMember.dob,
            house_number: newMember.houseNumber,
            village_town: newMember.villageTown,
            post_office: newMember.postOffice,
            police_station: newMember.policeStation,
            city: newMember.city,
            district: newMember.district,
            state: newMember.state,
            country: newMember.country,
            pincode: newMember.pincode,
            profile_completion: score,
          },
        ]);
      } catch (err) {
        console.warn('Supabase approve sync bypassed:', err);
      }
    })();

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

    // Sync to Supabase
    (async () => {
      try {
        await supabase
          .from('applications')
          .update({
            status: 'REJECTED',
            rejection_reason: reason,
            reviewed_by: currentUser?.name || 'ADMIN',
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', applicationId);
      } catch (err) {
        console.warn('Supabase reject sync bypassed:', err);
      }
    })();

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

    // Sync update to Supabase
    (async () => {
      try {
        const updatePayload: any = {};
        if (updatedFields.name) updatePayload.name = updatedFields.name;
        if (updatedFields.fatherName) updatePayload.father_name = updatedFields.fatherName;
        if (updatedFields.whatsapp) updatePayload.whatsapp = updatedFields.whatsapp;
        if (updatedFields.altMobile !== undefined) updatePayload.alt_mobile = updatedFields.altMobile;
        if (updatedFields.email) updatePayload.email = updatedFields.email;
        if (updatedFields.aadhaar !== undefined) updatePayload.aadhaar = updatedFields.aadhaar;
        if (updatedFields.bloodGroup) updatePayload.blood_group = updatedFields.bloodGroup;
        if (updatedFields.dob) updatePayload.dob = updatedFields.dob;
        if (updatedFields.houseNumber !== undefined) updatePayload.house_number = updatedFields.houseNumber;
        if (updatedFields.villageTown) updatePayload.village_town = updatedFields.villageTown;
        if (updatedFields.postOffice !== undefined) updatePayload.post_office = updatedFields.postOffice;
        if (updatedFields.policeStation !== undefined) updatePayload.police_station = updatedFields.policeStation;
        if (updatedFields.city !== undefined) updatePayload.city = updatedFields.city;
        if (updatedFields.district !== undefined) updatePayload.district = updatedFields.district;
        if (updatedFields.state !== undefined) updatePayload.state = updatedFields.state;
        if (updatedFields.pincode) updatePayload.pincode = updatedFields.pincode;
        if (updatedFields.status) updatePayload.status = updatedFields.status;

        await supabase.from('members').update(updatePayload).eq('member_id', memberId);
      } catch (err) {
        console.warn('Supabase member profile update bypassed:', err);
      }
    })();

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
    const toInsertDb: any[] = [];

    importedData.forEach((item, index) => {
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
        district: item.district || 'Purba Medinipur',
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

      toInsertDb.push({
        member_id: newMember.memberId,
        from_no: newMember.fromNo,
        user_id: newMember.userId,
        role: newMember.role,
        status: newMember.status,
        admission_date: newMember.admissionDate,
        name: newMember.name,
        father_name: newMember.fatherName,
        whatsapp: newMember.whatsapp,
        email: newMember.email,
        blood_group: newMember.bloodGroup,
        village_town: newMember.villageTown,
        district: newMember.district,
        pincode: newMember.pincode,
        profile_completion: newMember.profileCompletion,
      });
    });

    setMembers(newMemberList);

    if (toInsertDb.length > 0) {
      (async () => {
        try {
          await supabase.from('members').insert(toInsertDb);
        } catch (err) {
          console.warn('Supabase batch insert bypassed:', err);
        }
      })();
    }

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
    (async () => {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch (err) {
        console.warn('Supabase mark notification bypassed:', err);
      }
    })();
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    (async () => {
      try {
        await supabase.from('notifications').update({ read: true }).neq('id', '0');
      } catch (err) {
        console.warn('Supabase mark all notifications bypassed:', err);
      }
    })();
  };

  const updateClubSettings = (newSettings: Partial<ClubSettings>) => {
    setClubSettings((prev) => ({ ...prev, ...newSettings }));
    (async () => {
      try {
        const payload: any = {};
        if (newSettings.clubNameBengali) payload.club_name_bengali = newSettings.clubNameBengali;
        if (newSettings.clubNameEnglish) payload.club_name_english = newSettings.clubNameEnglish;
        if (newSettings.tagline) payload.tagline = newSettings.tagline;
        if (newSettings.contactEmail) payload.contact_email = newSettings.contactEmail;
        if (newSettings.contactPhone) payload.contact_phone = newSettings.contactPhone;
        if (newSettings.address) payload.address = newSettings.address;
        if (newSettings.logoUrl) payload.logo_url = newSettings.logoUrl;
        if (newSettings.registrationOpen !== undefined) payload.registration_open = newSettings.registrationOpen;
        if (newSettings.autoGenerateMemberId !== undefined) payload.auto_generate_member_id = newSettings.autoGenerateMemberId;
        if (newSettings.memberIdPrefix) payload.member_id_prefix = newSettings.memberIdPrefix;

        await supabase.from('club_settings').update(payload).neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('Supabase update settings bypassed:', err);
      }
    })();
    addActivityLog(`Updated club settings`, undefined, 'General club info updated');
  };

  // Assign or remove a committee role for any member (Admin only)
  const assignCommitteeRole = (memberId: string, role: string | null) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.memberId === memberId || m.id === memberId) {
          return { ...m, committeeRole: role ?? undefined, updatedAt: new Date().toISOString() };
        }
        return m;
      })
    );

    // Sync to Supabase
    (async () => {
      try {
        await supabase
          .from('members')
          .update({ committee_role: role ?? null })
          .eq('member_id', memberId);
      } catch (err) {
        console.warn('Supabase committee_role sync bypassed:', err);
      }
    })();

    const target = members.find((m) => m.memberId === memberId || m.id === memberId);
    addActivityLog(
      role
        ? `Assigned committee role "${role}" to ${memberId}`
        : `Removed committee role from ${memberId}`,
      memberId,
      role ? `Member is now: ${role}` : 'Member reverted to normal member'
    );
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
        isLoading,
        refreshData: loadFromSupabase,
        setCurrentUserRole: (role) => setCurrentRole(role),
        login,
        logout,
        submitApplication,
        approveApplication,
        rejectApplication,
        updateMemberProfile,
        assignCommitteeRole,
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
