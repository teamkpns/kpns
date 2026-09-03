export type MembershipStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE' | 'SUSPENDED' | 'RESIGNED' | 'REJECTED';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type UserRole = 'MEMBER' | 'ADMIN' | 'SUPERADMIN';

export interface Member {
  id: string; // Internal UUID
  memberId: string; // e.g. KPNS75PP26
  fromNo: string; // e.g. 75
  userId: string; // e.g. PINTU75
  role: UserRole;
  status: MembershipStatus;
  admissionDate: string; // YYYY-MM-DD
  avatarUrl?: string;

  // Personal Information
  name: string;
  fatherName: string;
  whatsapp: string;
  altMobile?: string;
  email: string;
  aadhaar?: string;
  bloodGroup: BloodGroup | string;
  dob: string; // YYYY-MM-DD

  // Address Information
  houseNumber?: string;
  villageTown: string;
  postOffice?: string;
  policeStation?: string;
  city?: string;
  district?: string;
  state: string;
  country: string;
  pincode: string;

  // Computed & Meta
  profileCompletion: number; // 0 - 100
  missingFields: string[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Application {
  id: string; // e.g. KPNS-APP-2026-0001
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;

  // Personal Info
  name: string;
  fatherName: string;
  whatsapp: string;
  altMobile?: string;
  email: string;
  aadhaar?: string;
  bloodGroup: BloodGroup | string;
  dob: string;

  // Address Info
  houseNumber?: string;
  villageTown: string;
  postOffice?: string;
  policeStation?: string;
  city?: string;
  district?: string;
  state: string;
  country: string;
  pincode: string;

  // Approval Info (filled when approved)
  fromNo?: string;
  memberId?: string;
  admissionDate?: string;
  userId?: string;
  initialPassword?: string;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  memberId?: string;
  details?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
}

export interface ClubSettings {
  clubNameBengali: string;
  clubNameEnglish: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
  registrationOpen: boolean;
  autoGenerateMemberId: boolean;
  memberIdPrefix: string;
}
