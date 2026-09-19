import { Booking, BlockedDate } from '../types';

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatIndonesianDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export type DayAvailability = 'available' | 'booked' | 'blocked' | 'past';

export const checkDateAvailability = (
  dateStr: string,
  bookings: Booking[],
  blockedDates: BlockedDate[]
): {
  status: DayAvailability;
  isAvailable: boolean;
  reason?: string;
  booking?: Booking;
  blocked?: BlockedDate;
} => {
  const todayStr = new Date().toISOString().split('T')[0];

  if (dateStr < todayStr) {
    return {
      status: 'past',
      isAvailable: false,
      reason: 'Tanggal ini telah berlalu.',
    };
  }

  // Check blocked date
  const blocked = blockedDates.find((b) => b.date === dateStr);
  if (blocked) {
    return {
      status: 'blocked',
      isAvailable: false,
      reason: `Gedung ditutup/pemeliharaan: ${blocked.reason}`,
      blocked,
    };
  }

  // Check active booking (pending or confirmed)
  const activeBooking = bookings.find(
    (b) => b.date === dateStr && (b.status === 'confirmed' || b.status === 'pending')
  );
  if (activeBooking) {
    return {
      status: 'booked',
      isAvailable: false,
      reason: `Tanggal ini telah dibooking (${activeBooking.eventName}).`,
      booking: activeBooking,
    };
  }

  return {
    status: 'available',
    isAvailable: true,
  };
};

export const generateBookingId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TM-${year}${month}${day}-${randomSuffix}`;
};

/**
 * Menghitung batas akhir pelunasan (H-3 sebelum tanggal pelaksanaan acara)
 */
export const calculatePaymentDeadline = (eventDateStr: string): string => {
  if (!eventDateStr) return '';
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  // Kurangi 3 hari (H-3)
  eventDate.setDate(eventDate.getDate() - 3);
  const dYear = eventDate.getFullYear();
  const dMonth = String(eventDate.getMonth() + 1).padStart(2, '0');
  const dDay = String(eventDate.getDate()).padStart(2, '0');
  return `${dYear}-${dMonth}-${dDay}`;
};

/**
 * Menghitung sisa hari menuju tanggal pelaksanaan acara
 */
export const getDaysUntilEvent = (eventDateStr: string): number => {
  if (!eventDateStr) return 0;
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
