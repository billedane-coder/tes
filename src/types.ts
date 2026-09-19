export type EventCategory = 
  | 'rambu_tuka' // Pernikahan Adat Toraja / Syukuran
  | 'pernikahan_umum' // Resepsi Pernikahan
  | 'seminar_rapat' // Rapat Akbar, Seminar, Pelantikan
  | 'wisuda' // Wisuda Kampus / Sekolah
  | 'ibadah_natal_paskah' // Ibadah Raya Oikumene
  | 'seni_konser' // Festival Budaya, Pentas Musik
  | 'lainnya';

// Kategori Penyewa Gedung & Tarif Khusus
export type RenterCategory = 'ormas' | 'keagamaan' | 'umum';

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'completed';

export type PaymentStatus = 'unpaid' | 'dp_paid' | 'fully_paid'; // 'dp_paid' maintained for backwards compatibility; app now enforces full payment by H-3 without DP

export interface FacilityAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'seating' | 'sound' | 'multimedia' | 'cooling' | 'power';
}

export interface SelectedAddon {
  addonId: string;
  quantity: number;
}

export interface BookingFileAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl?: string;
  uploadedAt?: string;
}

export interface Booking {
  id: string; // e.g. TM-202609-001
  createdAt: string; // ISO date
  date: string; // YYYY-MM-DD
  renterCategory?: RenterCategory; // 'ormas' | 'keagamaan' | 'umum'
  eventCategory: EventCategory;
  eventName: string;
  
  // Penanggung Jawab / Pemesan
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerNik?: string;
  organization?: string;
  address: string;
  estimatedGuests: number;
  
  // Fasilitas & Biaya
  basePrice: number;
  addons: SelectedAddon[];
  totalPrice: number;
  dpAmount: number; // 0 for no DP policy (full payment required by H-3)
  
  // Berkas & Surat Permohonan
  suratPermohonanUrl?: string; // Link Google Drive / Cloud
  suratPermohonanFile?: BookingFileAttachment; // File upload PDF/DOC/Image
  
  // Status & Bukti
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentProofUrl?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export interface BlockedDate {
  id: string;
  date: string; // YYYY-MM-DD
  reason: string;
  blockedBy: string;
  createdAt: string;
}
