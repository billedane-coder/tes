import { FacilityAddon, EventCategory, Booking, BlockedDate, RenterCategory } from '../types';

export const HALL_INFO = {
  name: "Gedung Tammuan Mali'",
  tagline: "Gedung Pertemuan & Serbaguna Terbesar di Makale, Tana Toraja",
  address: "Jl. Tritura No. 1, Bombongan, Kec. Makale, Kabupaten Tana Toraja, Sulawesi Selatan 91811",
  landmark: "Tepat di kawasan pusat kota Makale, bersebelahan dengan Kolam Makale & Plaza Kolam Makale",
  capacityMax: 2500,
  parkingCapacity: "120+ Mobil & 250+ Motor",
  phone: "+62 821-9087-4321",
  whatsapp: "6282190874321",
  email: "pengelola.tammuanmali@tanatorajakab.go.id",
  operatingHours: "07:30 - 23:00 WITA",
};

// Tarif Sewa Berdasarkan Kategori Penyewa (Pemakaian Seharian Penuh 07:30 - 23:00 WITA)
export const RENTER_CATEGORY_PRICING: Record<RenterCategory, {
  id: RenterCategory;
  name: string;
  price: number;
  description: string;
  badge: string;
  badgeClass: string;
}> = {
  keagamaan: {
    id: 'keagamaan',
    name: 'Keagamaan',
    price: 3000000,
    description: 'Ibadah Raya Oikumene, Natal, Paskah, Retret Gereja, Pengajian Akbar, & Kegiatan Lembaga Keagamaan',
    badge: 'Tarif Keagamaan',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  ormas: {
    id: 'ormas',
    name: 'Organisasi Kemasyarakatan (Ormas)',
    price: 3500000,
    description: 'Kegiatan Ormas, Lembaga Swadaya, Yayasan, Komunitas Pemuda, & Paguyuban Masyarakat Toraja',
    badge: 'Tarif Ormas',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  umum: {
    id: 'umum',
    name: 'Umum / Komersial / Personal',
    price: 7500000,
    description: 'Resepsi Pernikahan, Rambu Tuka\', Wisuda Perguruan Tinggi, Konser/Pentas Seni, Rapat Dinas, & Kegiatan Umum',
    badge: 'Tarif Umum',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
  },
};

// Tarif Sewa Harian Default (Umum)
export const DAILY_RENTAL_PRICE = RENTER_CATEGORY_PRICING.umum.price;

// Biaya Angkut Sampah (Retribusi Dinas Lingkungan Hidup) & Tata Tertib Sampah
export const WASTE_DISPOSAL_FEE = 200000;
export const WASTE_DISPOSAL_NOTE = "Biaya sewa gedung belum termasuk biaya angkut sampah sebesar Rp 200.000 yang dibayarkan ke Dinas Lingkungan Hidup (DLH).";
export const WASTE_COLLECTION_NOTE = "Setiap penanggung jawab kegiatan setelah kegiatan selesai wajib mengumpulkan seluruh sampahnya ke dalam kantong plastik hitam (trash bag) yang disiapkan secara mandiri.";

// Fasilitas Utama Gedung Tammuan Mali'
export const PRIMARY_FACILITIES = [
  {
    id: 'main_hall',
    number: '1',
    name: 'Main Hall & Pendingin Udara (AC Standing)',
    description: "Aula pertemuan utama yang luas dan representatif dengan panggung ornamen ukiran Pa'tedong khas Toraja yang agung, dilengkapi fasilitas pendingin udara 4 unit AC Standing 5 PK yang sudah include dalam paket sewa untuk kenyamanan seluruh tamu.",
    highlights: [
      'Ruang auditorium utama berkapasitas besar hingga 2.500 orang',
      'Sudah termasuk fasilitas 4 Unit AC Standing 5 PK (Include)',
      'Panggung utama luas (18m x 7m) bernuansa ornamen khas Toraja',
      'Sirkulasi udara lega, langit-langit tinggi, & pencahayaan optimal',
      'Akses masuk dan keluar yang representatif di pusat kota Makale',
    ],
  },
  {
    id: 'kursi_futura_500',
    number: '2',
    name: 'Kursi Futura 500',
    description: 'Tersedia 500 unit kursi Futura berkualitas, kokoh dengan bantalan busa empuk dan sandaran nyaman (tanpa sarung kursi, sarung kursi disediakan mandiri oleh penyewa/dekorator).',
    highlights: [
      '500 unit kursi Futura siap pakai untuk para tamu',
      'Rangka pipa chrome kokoh dengan dudukan & sandaran busa empuk',
      'Fleksibel ditata untuk format theater, round-table, maupun seminar',
      'Kondisi terawat & bersih (tidak termasuk sarung kursi / cover)',
    ],
  },
];

export const FACILITY_ADDONS: FacilityAddon[] = [
  {
    id: 'meja_bundar',
    name: 'Paket Meja Bundar (Round Table)',
    description: 'Unit meja bundar representatif untuk format banquet/VIP. Catatan: Tidak termasuk taplak meja (taplak meja disediakan mandiri oleh penyewa/dekorator).',
    price: 1500000,
    category: 'seating',
  },
  {
    id: 'sound_system',
    name: 'Sound System Profesional & Wireless Mic',
    description: 'Paket tata suara berkualitas tinggi, mic wireless profesional, mixer audio, monitor panggung, serta teknisi operator audio standby.',
    price: 1800000,
    category: 'sound',
  },
];

export const EVENT_CATEGORY_LABELS: Record<EventCategory, { label: string; color: string; badgeClass: string }> = {
  rambu_tuka: {
    label: 'Rambu Tuka\' / Pesta Pernikahan Adat Toraja',
    color: '#b91c1c',
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
  },
  pernikahan_umum: {
    label: 'Resepsi Pernikahan Nasional / Umum',
    color: '#ea580c',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  seminar_rapat: {
    label: 'Seminar / Rapat Akbar / Dinas Pemda',
    color: '#0284c7',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  wisuda: {
    label: 'Wisuda & Dies Natalis Perguruan Tinggi',
    color: '#7c3aed',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  ibadah_natal_paskah: {
    label: 'Ibadah Raya / Natal / Paskah Oikumene',
    color: '#059669',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  seni_konser: {
    label: 'Pentas Seni Budaya / Konser Musik',
    color: '#db2777',
    badgeClass: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  lainnya: {
    label: 'Acara Khusus / Lainnya',
    color: '#4b5563',
    badgeClass: 'bg-gray-50 text-gray-700 border-gray-200',
  },
};

export const BANK_ACCOUNTS = [
  {
    bankName: 'Bank Sulselbar (Kas Pengelola Daerah)',
    accountNumber: '110-003-000892-1',
    accountHolder: 'UPTD Pengelola Gedung Tammuan Mali Tana Toraja',
    badge: 'Rekomendasi Resmi',
  },
  {
    bankName: 'Bank Rakyat Indonesia (BRI)',
    accountNumber: '0231-01-002934-53-8',
    accountHolder: 'Penerimaan Gedung Tammuan Mali',
    badge: 'Bebas Antar BRI',
  },
  {
    bankName: 'Bank Mandiri',
    accountNumber: '152-00-1988234-7',
    accountHolder: 'Tammuan Mali Convention Makale',
    badge: 'Transfer Virtual',
  },
  {
    bankName: 'QRIS Kas Retribusi Toraja',
    accountNumber: 'NMID: ID1020249821839',
    accountHolder: 'TAMMUAN MALI MAKALE TORAJA',
    badge: 'Scan Semua E-Wallet',
  },
];

// Helper to generate dynamic sample dates relative to current year/month
const currentYear = new Date().getFullYear();
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
const nextMonthNumber = new Date().getMonth() === 11 ? 1 : new Date().getMonth() + 2;
const nextMonth = String(nextMonthNumber).padStart(2, '0');
const nextYear = new Date().getMonth() === 11 ? currentYear + 1 : currentYear;

// Template resmi Surat Permohonan Pemakaian Gedung Tammuan Mali' Makale
export const SURAT_PERMOHONAN_TEMPLATE = `KOP SURAT (Bila dari Instansi / Organisasi / Panitia)
============================================================

Nomor       : 012/PAN-PEL/TM/2026
Lampiran    : 1 (satu) Berkas Proposal / Susunan Acara
Perihal     : Permohonan Izin Pemakaian Gedung Pertemuan Tammuan Mali' Makale

Kepada Yth.
Kepala UPTD Pengelola Gedung Tammuan Mali' Makale
Dinas Perumahan, Kawasan Permukiman dan Pertanahan Kab. Tana Toraja
di -
    Makale, Tana Toraja

Dengan hormat,

Sehubungan dengan rencana pelaksanaan kegiatan yang akan kami selenggarakan, dengan ini kami mengajukan permohonan izin pemakaian fasilitas Gedung Pertemuan Tammuan Mali' Makale dengan rincian sebagai berikut:

1. Nama Kegiatan / Acara   : [Isi Nama Acara Anda]
2. Kategori Pemohon/Penyewa: [Pilih: Keagamaan (Rp 3.000.000) / Ormas (Rp 3.500.000) / Umum (Rp 7.500.000)]
3. Hari / Tanggal          : [Isi Tanggal Pelaksanaan]
4. Waktu Pelaksanaan       : 07:30 - 23:00 WITA (Pemakaian Harian Penuh)
5. Perkiraan Jumlah Undangan: [...] Orang
6. Penanggung Jawab / Pemohon:
   - Nama Lengkap          : [Nama Penanggung Jawab Sesuai KTP]
   - Instansi / Keluarga   : [Nama Instansi / Keluarga Besar]
   - Nomor WhatsApp / HP   : [Nomor Kontak Aktif]
   - Alamat Domisili       : [Alamat Lengkap]

Bersama ini kami menyatakan bersedia mematuhi segala ketentuan dan tata tertib pemakaian gedung yang berlaku di UPTD Gedung Tammuan Mali', menjaga kebersihan fasilitas (termasuk mengumpulkan seluruh sampah acara ke dalam kantong plastik hitam yang kami siapkan sendiri), serta memenuhi kewajiban retribusi sewa gedung sesuai peraturan daerah Kabupaten Tana Toraja.

Demikian surat permohonan ini kami sampaikan. Atas perhatian, pertimbangan, dan kerja sama Bapak/Ibu, kami ucapkan terima kasih.


Makale, ............................ 2026

Hormat kami,
Pemohon / Penanggung Jawab Acara,



( .................................................... )
Nama Terang & Tanda Tangan / Stempel
`;

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: `TM-${currentYear}${currentMonth}-001`,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    date: `${currentYear}-${currentMonth}-24`,
    renterCategory: 'umum',
    eventCategory: 'rambu_tuka',
    eventName: "Pernikahan Adat Toraja Rambu Tuka' - Pong Banne & Banne Rante",
    customerName: 'Yohanes Pong Banne, S.T.',
    customerPhone: '081242398711',
    customerEmail: 'yohanes.banne@gmail.com',
    customerNik: '7318021204900002',
    organization: 'Keluarga Besar Banne & Rante (Kec. Makale)',
    address: 'Tongkonan Silaga, Kel. Bombongan, Makale',
    estimatedGuests: 1800,
    basePrice: 7500000,
    addons: [
      { addonId: 'meja_bundar', quantity: 1 },
      { addonId: 'sound_system', quantity: 1 },
    ],
    totalPrice: 10800000, // 7.500.000 + 1.500.000 + 1.800.000
    dpAmount: 0,
    suratPermohonanFile: {
      name: 'Surat_Permohonan_PongBanne_RambuTuka.pdf',
      size: 428000, // ~418 KB
      type: 'application/pdf',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    suratPermohonanUrl: 'https://drive.google.com/file/d/1A2B3C4D5E_TammuanMali_SuratPongBanne/view?usp=sharing',
    status: 'confirmed',
    paymentStatus: 'fully_paid',
    adminNotes: 'Lunas 100% via transfer Kas Daerah Sulselbar. Kategori Umum (Rp 7.500.000). Surat permohonan resmi telah diverifikasi UPTD.',
  },
  {
    id: `TM-${currentYear}${currentMonth}-002`,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date: `${currentYear}-${currentMonth}-28`,
    renterCategory: 'keagamaan',
    eventCategory: 'ibadah_natal_paskah',
    eventName: 'Ibadah Kebangunan Rohani & Doa Bagi Bangsa',
    customerName: 'Pdt. Markus Rombe, M.Th',
    customerPhone: '085299441234',
    customerEmail: 'panitia.ibadah@sinodegepsultra.org',
    customerNik: '7318014506820001',
    organization: 'Badan Pekerja Sinode Gereja Toraja',
    address: 'Jl. Nusantara No. 12, Makale',
    estimatedGuests: 1500,
    basePrice: 3000000,
    addons: [
      { addonId: 'sound_system', quantity: 1 },
    ],
    totalPrice: 4800000, // 3.000.000 + 1.800.000
    dpAmount: 0,
    suratPermohonanFile: {
      name: 'Surat_Permohonan_Ibadah_Sinode_GedungTammuanMali.pdf',
      size: 612000,
      type: 'application/pdf',
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    status: 'confirmed',
    paymentStatus: 'fully_paid',
    adminNotes: 'Lunas 100%. Tarif Khusus Keagamaan (Rp 3.000.000). Surat rekomendasi lembaga telah disahkan.',
  },
  {
    id: `TM-${currentYear}${nextMonth}-003`,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    date: `${nextYear}-${nextMonth}-05`,
    renterCategory: 'ormas',
    eventCategory: 'seminar_rapat',
    eventName: 'Musyawarah Besar & Pelantikan Pengurus KNPI Tana Toraja',
    customerName: 'Ir. Daniel Batara Pasolang',
    customerPhone: '081355443322',
    customerEmail: 'knpi.tanatoraja@gmail.com',
    customerNik: '7318051408780004',
    organization: 'DPD Komite Nasional Pemuda Indonesia (KNPI) Tana Toraja',
    address: 'Kompleks Pemuda Makale, Tana Toraja',
    estimatedGuests: 600,
    basePrice: 3500000,
    addons: [
      { addonId: 'sound_system', quantity: 1 },
    ],
    totalPrice: 5300000, // 3.500.000 + 1.800.000
    dpAmount: 0,
    suratPermohonanUrl: 'https://drive.google.com/file/d/1KNPI_TanaToraja_SuratMubes2026/view',
    status: 'pending',
    paymentStatus: 'unpaid',
    adminNotes: 'Tarif Khusus Ormas (Rp 3.500.000). Surat permohonan sedang ditelaah. Pelunasan penuh maksimal H-3.',
  },
  {
    id: `TM-${currentYear}${nextMonth}-004`,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    date: `${nextYear}-${nextMonth}-12`,
    renterCategory: 'umum',
    eventCategory: 'pernikahan_umum',
    eventName: 'Resepsi Pernikahan Dr. Kevin & Sarah, S.Ked',
    customerName: 'Dr. Kevin Rantetampang',
    customerPhone: '082344556677',
    customerEmail: 'kevin.rantetampang@yahoo.com',
    customerNik: '7318012509930001',
    organization: 'Kel. Rantetampang & Sambara',
    address: 'Jl. Veteran No. 45, Makale',
    estimatedGuests: 1200,
    basePrice: 7500000,
    addons: [
      { addonId: 'meja_bundar', quantity: 1 },
      { addonId: 'sound_system', quantity: 1 },
    ],
    totalPrice: 10800000, // 7.500.000 + 1.500.000 + 1.800.000
    dpAmount: 0,
    suratPermohonanFile: {
      name: 'Surat_Permohonan_Izin_Resepsi_Kevin_Sarah.pdf',
      size: 345000,
      type: 'application/pdf',
      uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    status: 'pending',
    paymentStatus: 'unpaid',
    adminNotes: 'Tarif Kategori Umum (Rp 7.500.000). Berkas permohonan sedang ditinjau. Pelunasan sewa wajib maksimal H-3.',
  },
];

export const INITIAL_BLOCKED_DATES: BlockedDate[] = [
  {
    id: 'block-001',
    date: `${currentYear}-${currentMonth}-20`,
    reason: 'Perawatan Rutin Sistem Pendingin (AC Standing) & Sound Check Tahunan UPTD',
    blockedBy: 'Admin UPTD Tammuan Mali',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'block-002',
    date: `${nextYear}-${nextMonth}-19`,
    reason: 'Persiapan Gladi Upacara Hari Jadi Tana Toraja & Agenda Khusus Pemda',
    blockedBy: 'Protokoler Pemkab Tana Toraja',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
