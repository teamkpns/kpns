import { Member } from '@/types';

/**
 * Calculates profile completion percentage and list of missing fields.
 */
export function calculateProfileCompletion(data: Partial<Member>): {
  score: number;
  missingFields: string[];
} {
  const fields: { key: keyof Member; label: string; weight: number }[] = [
    { key: 'name', label: 'Member Name', weight: 10 },
    { key: 'fatherName', label: "Father's Name", weight: 10 },
    { key: 'whatsapp', label: 'WhatsApp Number', weight: 15 },
    { key: 'email', label: 'Email ID', weight: 10 },
    { key: 'bloodGroup', label: 'Blood Group', weight: 10 },
    { key: 'dob', label: 'Date of Birth', weight: 10 },
    { key: 'aadhaar', label: 'Aadhaar Number', weight: 10 },
    { key: 'villageTown', label: 'Village / Town', weight: 10 },
    { key: 'postOffice', label: 'Post Office', weight: 5 },
    { key: 'policeStation', label: 'Police Station', weight: 5 },
    { key: 'city', label: 'City', weight: 5 },
    { key: 'state', label: 'State', weight: 5 },
    { key: 'pincode', label: 'Pincode', weight: 5 },
  ];

  let currentScore = 0;
  let totalPossible = 0;
  const missingFields: string[] = [];

  for (const item of fields) {
    totalPossible += item.weight;
    const val = data[item.key];
    if (val && typeof val === 'string' && val.trim().length > 0) {
      currentScore += item.weight;
    } else {
      missingFields.push(`${item.label} missing`);
    }
  }

  const score = Math.min(100, Math.round((currentScore / totalPossible) * 100));

  return { score, missingFields };
}

/**
 * Masks Aadhaar number to XXXX XXXX 1234
 */
export function maskAadhaar(aadhaar?: string): string {
  if (!aadhaar) return 'Not Provided';
  const clean = aadhaar.replace(/\s+/g, '');
  if (clean.length < 4) return clean;
  const lastFour = clean.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}

/**
 * Formats date into DD-MM-YYYY or readable string
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Evaluates password strength
 */
export function evaluatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: 'None', color: '#E5E7EB' };
  let strength = 0;

  if (password.length >= 6) strength += 25;
  if (password.length >= 10) strength += 15;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;

  const score = Math.min(100, strength);

  if (score < 40) return { score, label: 'Weak', color: '#DC2626' };
  if (score < 70) return { score, label: 'Moderate', color: '#F59E0B' };
  return { score, label: 'Strong', color: '#16A34A' };
}

/**
 * Group members by birthday timelines
 */
export function getBirthdayGroups(members: Member[]) {
  // Use simulated current date (e.g. 2026-09-02) or system date
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentDay = now.getDate();

  const today: Member[] = [];
  const thisWeek: Member[] = [];
  const thisMonth: Member[] = [];

  members.forEach((m) => {
    if (!m.dob) return;
    const birthDate = new Date(m.dob);
    if (isNaN(birthDate.getTime())) return;

    const bMonth = birthDate.getMonth();
    const bDay = birthDate.getDate();

    if (bMonth === currentMonth) {
      if (bDay === currentDay) {
        today.push(m);
      }
      const dayDiff = bDay - currentDay;
      if (dayDiff >= 0 && dayDiff <= 7) {
        thisWeek.push(m);
      }
      thisMonth.push(m);
    }
  });

  return { today, thisWeek, thisMonth };
}

/**
 * Generates initial User ID and Member ID
 */
export function generateSuggestedMemberId(fromNo: string, name: string): {
  memberId: string;
  userId: string;
} {
  const cleanName = (name || 'Member').trim().toUpperCase().replace(/[^A-Z]/g, '');
  const initials = cleanName.slice(0, 2) || 'KP';
  const cleanFromNo = (fromNo || '00').padStart(2, '0');
  const yearSuffix = new Date().getFullYear().toString().slice(-2);

  const memberId = `KPNS${cleanFromNo}${initials}${yearSuffix}`;
  const userId = `${cleanName.slice(0, 5)}${cleanFromNo}`;

  return { memberId, userId };
}
