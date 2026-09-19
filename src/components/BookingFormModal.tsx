import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Building,
  UploadCloud,
  Link as LinkIcon,
  FileCheck,
  Trash2,
  ExternalLink,
  Download,
  Info,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Booking, BlockedDate, EventCategory, RenterCategory, SelectedAddon, BookingFileAttachment } from '../types';
import { FACILITY_ADDONS, EVENT_CATEGORY_LABELS, BANK_ACCOUNTS, DAILY_RENTAL_PRICE, RENTER_CATEGORY_PRICING, WASTE_DISPOSAL_FEE, WASTE_DISPOSAL_NOTE, WASTE_COLLECTION_NOTE } from '../data/constants';
import { formatIDR, formatIndonesianDate, checkDateAvailability, generateBookingId, calculatePaymentDeadline } from '../utils/dateUtils';
import { SuratTemplateModal } from './SuratTemplateModal';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  bookings: Booking[];
  blockedDates: BlockedDate[];
  onSubmitBooking: (booking: Booking) => void;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  bookings,
  blockedDates,
  onSubmitBooking,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(initialDate || todayStr);
  const [renterCategory, setRenterCategory] = useState<RenterCategory>('umum');
  const [eventCategory, setEventCategory] = useState<EventCategory>('rambu_tuka');
  const [eventName, setEventName] = useState<string>('');
  const [estimatedGuests, setEstimatedGuests] = useState<number>(1000);

  // Customer info
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerNik, setCustomerNik] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  // Surat Permohonan: Link & Upload File
  const [suratUrl, setSuratUrl] = useState<string>('');
  const [suratFile, setSuratFile] = useState<BookingFileAttachment | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Addons
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDate) setDate(initialDate);
  }, [initialDate, isOpen]);

  // Helper format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle file selected or dropped
  const processSelectedFile = (file: File) => {
    setFileError(null);
    if (!file) return;

    // Check size limit: 15MB
    if (file.size > 15 * 1024 * 1024) {
      setFileError('Ukuran file maksimal 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSuratFile({
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => {
      setFileError('Gagal memproses file. Silakan coba unggah kembali.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSuratFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  // Real-time date availability check
  const availabilityCheck = checkDateAvailability(date, bookings, blockedDates);

  // Calculate pricing based on selected renterCategory
  const currentRenterPricing = RENTER_CATEGORY_PRICING[renterCategory] || RENTER_CATEGORY_PRICING.umum;
  const basePrice = currentRenterPricing.price;
  const addonsTotal = Object.entries(selectedAddons).reduce((acc, [addonId, qty]) => {
    if (qty > 0) {
      const item = FACILITY_ADDONS.find((a) => a.id === addonId);
      return acc + (item ? item.price * qty : 0);
    }
    return acc;
  }, 0);

  const totalPrice = basePrice + addonsTotal;
  const paymentDeadline = calculatePaymentDeadline(date);

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddons((prev) => ({
      ...prev,
      [addonId]: prev[addonId] ? 0 : 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!date) {
      setFormError('Mohon pilih tanggal pelaksanaan acara.');
      return;
    }
    if (date < todayStr) {
      setFormError('Tanggal tidak boleh di masa lalu.');
      return;
    }
    if (!availabilityCheck.isAvailable) {
      setFormError(`Tanggal tidak dapat dipesan: ${availabilityCheck.reason}`);
      return;
    }
    if (!eventName.trim()) {
      setFormError('Mohon isi nama acara yang akan diselenggarakan.');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Mohon lengkapi nama penanggung jawab / pemesan.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('Mohon isi nomor telepon / WhatsApp yang aktif.');
      return;
    }

    const addonsList: SelectedAddon[] = Object.entries(selectedAddons)
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, qty]) => ({ addonId, quantity: qty }));

    const newBooking: Booking = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      date,
      renterCategory,
      eventCategory,
      eventName: eventName.trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || `${customerPhone.trim()}@tammuanmali.id`,
      customerNik: customerNik.trim() || undefined,
      organization: organization.trim() || undefined,
      address: address.trim() || 'Tana Toraja, Sulawesi Selatan',
      estimatedGuests: Number(estimatedGuests) || 500,
      basePrice,
      addons: addonsList,
      totalPrice,
      dpAmount: 0,
      suratPermohonanUrl: suratUrl.trim() || undefined,
      suratPermohonanFile: suratFile || undefined,
      status: 'pending',
      paymentStatus: 'unpaid',
      adminNotes: `Kategori: ${currentRenterPricing.name} (${formatIDR(basePrice)}). Tanpa uang muka (DP). Pelunasan penuh maksimal H-3 (${formatIndonesianDate(paymentDeadline)}).`,
    };

    onSubmitBooking(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-amber-900/40">
          <div>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block mb-0.5">
              Formulir Reservasi Resmi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-100">
              Booking Gedung Tammuan Mali' Makale
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
            aria-label="Tutup Formulir"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Mohon Periksa Kembali Form Anda</p>
                <p className="text-xs text-red-700 mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          {/* Section 1: Tanggal Pelaksanaan Acara */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <Calendar className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                1. Tanggal Pelaksanaan Acara
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Pilih Tanggal Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-stone-900"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Hari: <strong className="text-stone-800">{formatIndonesianDate(date)}</strong> (Seharian Penuh)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Estimasi Jumlah Undangan / Tamu
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    step="50"
                    value={estimatedGuests}
                    onChange={(e) => setEstimatedGuests(Number(e.target.value))}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-stone-900"
                  />
                  <Users className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Kapasitas aula maksimum s/d 2.500 orang
                </p>
              </div>
            </div>

            {/* Availability Warning */}
            {!availabilityCheck.isAvailable && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>
                  <strong>Tanggal Tidak Tersedia:</strong> {availabilityCheck.reason}
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Data Acara & Kategori Penyewa */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  2. Kategori Penyewa & Detail Acara
                </h3>
              </div>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                Pilih kategori penyewa untuk menentukan tarif sewa resmi
              </span>
            </div>

            {/* Pemilihan Kategori Penyewa (Ormas / Keagamaan / Umum) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                Kategori Penyewa Gedung <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Opsi Keagamaan */}
                <div
                  onClick={() => setRenterCategory('keagamaan')}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                    renterCategory === 'keagamaan'
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Keagamaan
                    </span>
                    <input
                      type="radio"
                      name="renterCategory"
                      checked={renterCategory === 'keagamaan'}
                      onChange={() => setRenterCategory('keagamaan')}
                      className="text-emerald-600 focus:ring-emerald-500 h-4 w-4 mt-0.5"
                    />
                  </div>
                  <div className="text-xl font-black text-emerald-950 mb-1">
                    {formatIDR(RENTER_CATEGORY_PRICING.keagamaan.price)}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Ibadah Raya, Natal, Paskah, Retret Gereja, Pengajian & Kegiatan Keagamaan
                  </p>
                </div>

                {/* Opsi Ormas */}
                <div
                  onClick={() => setRenterCategory('ormas')}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                    renterCategory === 'ormas'
                      ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      Ormas
                    </span>
                    <input
                      type="radio"
                      name="renterCategory"
                      checked={renterCategory === 'ormas'}
                      onChange={() => setRenterCategory('ormas')}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                    />
                  </div>
                  <div className="text-xl font-black text-blue-950 mb-1">
                    {formatIDR(RENTER_CATEGORY_PRICING.ormas.price)}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Organisasi Kemasyarakatan, LSM, Paguyuban, Yayasan, & Komunitas Kepemudaan
                  </p>
                </div>

                {/* Opsi Umum */}
                <div
                  onClick={() => setRenterCategory('umum')}
                  className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative ${
                    renterCategory === 'umum'
                      ? 'border-amber-600 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      Umum
                    </span>
                    <input
                      type="radio"
                      name="renterCategory"
                      checked={renterCategory === 'umum'}
                      onChange={() => setRenterCategory('umum')}
                      className="text-amber-600 focus:ring-amber-500 h-4 w-4 mt-0.5"
                    />
                  </div>
                  <div className="text-xl font-black text-amber-950 mb-1">
                    {formatIDR(RENTER_CATEGORY_PRICING.umum.price)}
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Resepsi Pernikahan, Rambu Tuka', Wisuda, Pentas Musik, Seminar & Acara Komersial
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Jenis / Format Acara <span className="text-red-500">*</span>
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-stone-900 bg-white"
                >
                  {Object.entries(EVENT_CATEGORY_LABELS).map(([catKey, info]) => (
                    <option key={catKey} value={catKey}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nama Acara / Judul Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Resepsi Pernikahan Adat Tongkonan Silaga"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Identitas Pemesan / Penanggung Jawab */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <User className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                3. Identitas Pemesan / Penanggung Jawab
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Penanggung Jawab <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nama Lengkap sesuai KTP"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                    required
                  />
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                    required
                  />
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Bukti booking & konfirmasi dikirimkan via WhatsApp
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Alamat Email (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Instansi / Nama Keluarga Besar (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Contoh: Rumpun Keluarga Sambolangi / Bappeda"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                  />
                  <Building className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Alamat Domisili Pemesan
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kelurahan / Lembang, Kecamatan, Kabupaten/Kota"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm text-stone-900 font-medium"
                  />
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Kelengkapan Berkas: Surat Permohonan */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  4. Surat Permohonan Pemakaian Gedung
                </h3>
              </div>
              <button
                type="button"
                id="btn-open-template-modal"
                onClick={() => setShowTemplateModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Lihat & Unduh Format Template Surat</span>
              </button>
            </div>

            <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-5">
              <div className="flex items-start gap-3 text-xs text-stone-600">
                <Info className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  Untuk mempercepat proses verifikasi dan penerbitan izin resmi, Anda dapat melampirkan <strong>Surat Permohonan</strong> (dan/atau proposal kegiatan) melalui <strong>Upload Berkas</strong> langsung atau mencantumkan <strong>Link Google Drive</strong> di bawah ini.
                </p>
              </div>

              {/* Grid 2 Columns for Upload & Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Upload Surat Permohonan */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Upload Berkas Surat Permohonan:
                  </label>

                  {/* Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    id="input-file-surat"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {!suratFile ? (
                    <div
                      id="dropzone-surat-permohonan"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-amber-600 bg-amber-50/70 scale-[0.99]'
                          : 'border-stone-300 bg-white hover:border-amber-500 hover:bg-amber-50/20'
                      }`}
                    >
                      <div className="w-10 h-10 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-stone-900">
                        Klik untuk Pilih Berkas atau Tarik File ke Sini
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        Format didukung: PDF, DOC, DOCX, JPG, PNG (Maks 15 MB)
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-white border border-emerald-300 rounded-2xl shadow-2xs space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                            <FileCheck className="w-5 h-5" />
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {suratFile.name}
                            </p>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {formatFileSize(suratFile.size)} • Siap dikirim
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id="btn-remove-surat-file"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                          title="Hapus file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Berkas Terlampir
                        </span>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-amber-700 hover:text-amber-800 font-semibold hover:underline"
                        >
                          Ganti Berkas
                        </button>
                      </div>
                    </div>
                  )}

                  {fileError && (
                    <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {fileError}
                    </p>
                  )}
                </div>

                {/* 2. Link Surat Permohonan (Google Drive / Cloud) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                    Link Surat Permohonan (Google Drive / Cloud):
                  </label>

                  <div className="relative">
                    <input
                      id="input-link-surat"
                      type="url"
                      placeholder="https://drive.google.com/file/d/... atau Dropbox/OneDrive"
                      value={suratUrl}
                      onChange={(e) => setSuratUrl(e.target.value)}
                      className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-xs sm:text-sm text-stone-900 font-medium bg-white"
                    />
                    <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Jika surat/proposal disimpan di Google Drive, pastikan akses tautan diatur ke <em>"Siapa saja yang memiliki link / Anyone with the link"</em>.
                  </p>

                  {suratUrl.trim() && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-[11px]">
                      <span className="text-amber-900 font-medium truncate max-w-[200px] sm:max-w-[240px]">
                        Tautan terisi: {suratUrl}
                      </span>
                      <a
                        href={suratUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-amber-800 font-bold hover:underline shrink-0 ml-2"
                      >
                        <span>Uji Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Paket Fasilitas Tambahan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                5. Fasilitas Gedung & Tambahan (Opsional)
              </h3>
            </div>

            {/* Fasilitas Utama yang Sudah Termasuk */}
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2.5">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Fasilitas Utama (Sudah Termasuk dalam Sewa Gedung):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center gap-2.5 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <span className="font-bold text-stone-900">1. Main Hall + 4 Unit AC Standing 5 PK</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center gap-2.5 shadow-2xs">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <div>
                    <span className="font-bold text-stone-900 block">2. Kursi Futura 500 Unit</span>
                    <span className="text-[10px] text-stone-500 font-normal">(Tidak termasuk sarung kursi)</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              Pilih fasilitas tambahan di bawah ini jika acara Anda memerlukan perlengkapan pendukung lainnya:
            </p>

            <div className="space-y-2.5">
              {FACILITY_ADDONS.map((addon) => {
                const isChecked = !!selectedAddons[addon.id];
                return (
                  <label
                    key={addon.id}
                    className={`flex items-start justify-between gap-4 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-amber-50/60 border-amber-500 ring-1 ring-amber-500/20'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAddon(addon.id)}
                        className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-stone-900">
                          {addon.name}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {addon.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-amber-800 whitespace-nowrap">
                      +{formatIDR(addon.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 6: Rincian Biaya & Rekening Kas Daerah */}
          <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-stone-900">
                6. Kalkulasi Biaya Sewa Harian & Rekening Resmi
              </h3>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-stone-600">
                <span>Tarif Sewa Gedung ({currentRenterPricing.name}):</span>
                <span className="font-semibold text-stone-900">{formatIDR(basePrice)}</span>
              </div>

              {addonsTotal > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Fasilitas Tambahan Terpilih:</span>
                  <span className="font-semibold text-stone-900">+{formatIDR(addonsTotal)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-200 flex justify-between text-stone-900 font-bold text-sm sm:text-base">
                <span>Total Biaya Sewa Gedung:</span>
                <span className="text-amber-700 text-lg sm:text-xl font-extrabold">
                  {formatIDR(totalPrice)}
                </span>
              </div>

              {/* Catatan Biaya Angkut Sampah DLH & Pengumpulan Sampah Plastik Hitam */}
              <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-300/80 text-xs text-stone-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="leading-relaxed space-y-1">
                  <div>
                    <span className="font-bold text-amber-950">Catatan Penting Retribusi Kebersihan: </span>
                    <span>
                      Biaya sewa gedung di atas <strong>belum termasuk biaya angkut sampah sebesar {formatIDR(WASTE_DISPOSAL_FEE)}</strong> yang dibayarkan terpisah ke <strong>Dinas Lingkungan Hidup (DLH)</strong>.
                    </span>
                  </div>
                  <div className="pt-1 border-t border-amber-200 text-amber-950">
                    <span className="font-bold">Kewajiban Pengumpulan Sampah: </span>
                    <span>
                      Setiap penanggung jawab kegiatan setelah acara selesai <strong>wajib mengumpulkan seluruh sampahnya ke dalam kantong plastik hitam</strong> yang disiapkan secara mandiri oleh pihak penyelenggara.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms: No DP & H-3 Full Payment */}
            <div className="pt-3 border-t border-stone-200">
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Kebijakan Pembayaran: Tanpa Uang Muka (Tanpa DP)</span>
                </div>
                <div className="text-xs text-stone-700 space-y-1.5 leading-relaxed">
                  <p>
                    Pemesanan gedung <strong>tidak memerlukan uang muka (DP)</strong>. Jadwal Anda dapat langsung diajukan untuk verifikasi pengelola.
                  </p>
                  <div className="p-2.5 bg-white/90 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Batas Akhir Pelunasan Sewa: </span>
                      <span className="font-semibold text-stone-900">
                        Paling lambat <strong>H-3 sebelum kegiatan</strong> (
                        {date ? formatIndonesianDate(paymentDeadline) : '3 hari sebelum acara'}).
                      </span>
                      <p className="text-stone-500 mt-0.5">
                        Total yang harus dilunasi adalah <strong>{formatIDR(totalPrice)}</strong> ke rekening kas resmi pengelola sebelum pelaksanaan acara.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Bank Accounts */}
            <div className="pt-3 border-t border-stone-200 text-xs">
              <p className="font-semibold text-stone-800 mb-2">
                Nomor Rekening Resmi Kas Daerah / Pengelola untuk Pelunasan:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {BANK_ACCOUNTS.slice(0, 2).map((bank) => (
                  <div key={bank.bankName} className="p-2.5 rounded-lg bg-white border border-stone-200">
                    <p className="font-bold text-stone-900">{bank.bankName}</p>
                    <p className="font-mono text-amber-800 font-semibold text-xs mt-0.5 select-all">
                      {bank.accountNumber}
                    </p>
                    <p className="text-stone-500 text-[10px]">a.n {bank.accountHolder}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button & Policies */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="text-[11px] text-stone-500 leading-relaxed">
              Dengan mengklik <strong>"Kirim Permohonan Reservasi"</strong>, data Anda akan tercatat dalam kalender UPTD Gedung Tammuan Mali' Makale tanpa perlu uang muka. Penanggung jawab bersedia mematuhi tata tertib pelunasan H-3 serta <strong>mengumpulkan sampah pasca acara ke dalam kantong plastik hitam mandiri</strong> (retribusi DLH {formatIDR(WASTE_DISPOSAL_FEE)} dibayarkan terpisah).
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={!availabilityCheck.isAvailable}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${
                  !availabilityCheck.isAvailable
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-amber-900/20'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kirim Permohonan Reservasi ({formatIDR(totalPrice)})</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Format & Template Surat Permohonan */}
      <SuratTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
    </div>
  );
};
