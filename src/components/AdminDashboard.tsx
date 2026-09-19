import React, { useState } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Download, 
  Wrench, 
  Trash2, 
  Plus, 
  Filter, 
  Coins, 
  Printer, 
  PhoneCall, 
  RefreshCw,
  FileText,
  ExternalLink,
  FileCheck,
  Clock
} from 'lucide-react';
import { Booking, BlockedDate, BookingStatus, PaymentStatus } from '../types';
import { EVENT_CATEGORY_LABELS, DAILY_RENTAL_PRICE, RENTER_CATEGORY_PRICING, WASTE_DISPOSAL_FEE } from '../data/constants';
import { formatIDR, formatIndonesianDate, checkDateAvailability, calculatePaymentDeadline } from '../utils/dateUtils';

interface AdminDashboardProps {
  bookings: Booking[];
  blockedDates: BlockedDate[];
  onUpdateBookingStatus: (id: string, status: BookingStatus, notes?: string, rejectionReason?: string) => void;
  onUpdatePaymentStatus: (id: string, paymentStatus: PaymentStatus, dpAmount?: number) => void;
  onRescheduleBooking: (id: string, newDate: string) => void;
  onDeleteBooking: (id: string) => void;
  onAddBlockedDate: (newBlock: Omit<BlockedDate, 'id' | 'createdAt'>) => void;
  onRemoveBlockedDate: (id: string) => void;
  onOpenReceipt: (booking: Booking) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  blockedDates,
  onUpdateBookingStatus,
  onUpdatePaymentStatus,
  onRescheduleBooking,
  onDeleteBooking,
  onAddBlockedDate,
  onRemoveBlockedDate,
  onOpenReceipt,
  onLogout,
  onViewPublicSite,
}) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'maintenance' | 'reports'>('reservations');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection modal state
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Reschedule modal state
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState('');

  // Block date form state
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');

  // KPI Calculations
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + b.totalPrice, 0);
  const paidRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => {
      if (b.paymentStatus === 'fully_paid') return acc + b.totalPrice;
      return acc;
    }, 0);

  // Filtered reservations
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      b.id.toLowerCase().includes(query) ||
      b.customerName.toLowerCase().includes(query) ||
      b.eventName.toLowerCase().includes(query) ||
      b.customerPhone.includes(query);
    return matchesStatus && matchesQuery;
  });

  const handleConfirmReject = () => {
    if (!rejectingBookingId) return;
    onUpdateBookingStatus(
      rejectingBookingId,
      'rejected',
      undefined,
      rejectionReason || 'Jadwal bentrok atau permohonan tidak memenuhi syarat dinas.'
    );
    setRejectingBookingId(null);
    setRejectionReason('');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingBooking || !newRescheduleDate) return;
    onRescheduleBooking(reschedulingBooking.id, newRescheduleDate);
    setReschedulingBooking(null);
  };

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate || !blockReason.trim()) return;

    onAddBlockedDate({
      date: blockDate,
      reason: blockReason.trim(),
      blockedBy: 'Admin UPTD Tammuan Mali',
    });

    setBlockDate('');
    setBlockReason('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Kode Booking',
      'Tanggal Acara',
      'Batas Pelunasan (H-3)',
      'Kategori',
      'Nama Acara',
      'Penanggung Jawab',
      'No Telepon',
      'Estimasi Tamu',
      'Total Biaya (IDR)',
      'Status Reservasi',
      'Status Pembayaran',
      'File Surat Permohonan',
      'Link Surat Permohonan',
      'Dibuat Pada',
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.date}"`,
      `"${calculatePaymentDeadline(b.date)}"`,
      `"${b.eventCategory}"`,
      `"${b.eventName.replace(/"/g, '""')}"`,
      `"${b.customerName.replace(/"/g, '""')}"`,
      `"${b.customerPhone}"`,
      b.estimatedGuests,
      b.totalPrice,
      `"${b.status}"`,
      `"${b.paymentStatus}"`,
      `"${b.suratPermohonanFile ? b.suratPermohonanFile.name.replace(/"/g, '""') : '-'}"`,
      `"${b.suratPermohonanUrl ? b.suratPermohonanUrl.replace(/"/g, '""') : '-'}"`,
      `"${b.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Reservasi_Gedung_Tammuan_Mali_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Admin Top Navigation */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-stone-950 font-bold">
                <ShieldCheck className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <h1 className="font-bold text-base text-amber-100 flex items-center gap-2">
                  <span>Panel Kontrol Admin</span>
                  <span className="text-[10px] font-semibold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    Gedung Tammuan Mali'
                  </span>
                </h1>
                <p className="text-xs text-stone-400">
                  UPTD Pengelola Gedung & Aset Daerah Makale
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={onViewPublicSite}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Lihat Website</span>
              </button>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-800/60"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Total Reservasi</span>
              <Calendar className="w-4 h-4 text-stone-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-stone-900">{totalBookings}</p>
            <p className="text-[11px] text-stone-500 mt-1">Seluruh data tercatat</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-amber-800 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Perlu Persetujuan</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-black text-amber-700">{pendingBookings.length}</p>
              {pendingBookings.length > 0 && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                  Tindakan Dibutuhkan
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Menunggu verifikasi admin</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-emerald-800 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Terkonfirmasi</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700">{confirmedBookings.length}</p>
            <p className="text-[11px] text-stone-500 mt-1">Jadwal resmi terkunci</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider">Retribusi Lunas (100%)</span>
              <Coins className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl sm:text-2xl font-black text-stone-900">{formatIDR(paidRevenue)}</p>
            <p className="text-[11px] text-stone-500 mt-1">
              Potensi Total: {formatIDR(totalRevenue)}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-300 pb-2">
          <div className="flex items-center gap-1 bg-stone-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'reservations'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daftar Reservasi ({filteredBookings.length})
            </button>

            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'maintenance'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Blokir Tanggal / Maintenance ({blockedDates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reports'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor & Rekap Laporan</span>
            </button>
          </div>

          {activeTab === 'reservations' && (
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Download CSV</span>
            </button>
          )}
        </div>

        {/* TAB 1: RESERVATIONS CONTROL */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                <span className="text-xs font-bold text-stone-500 mr-2 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Status:
                </span>
                {['all', 'pending', 'confirmed', 'completed', 'rejected'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'Semua'
                      : st === 'pending'
                      ? 'Pending'
                      : st === 'confirmed'
                      ? 'Disetujui'
                      : st === 'completed'
                      ? 'Selesai'
                      : 'Ditolak'}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Cari nama, acara, kode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-xs text-stone-900"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Reservations List */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
                <Calendar className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="font-bold text-stone-700">Tidak ada reservasi yang sesuai kriteria.</p>
                <p className="text-xs text-stone-500 mt-1">Coba ubah kata kunci atau filter status.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => {
                  const cat = EVENT_CATEGORY_LABELS[b.eventCategory];

                  return (
                    <div
                      key={b.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                        b.status === 'pending'
                          ? 'border-amber-300 ring-1 ring-amber-300/50 bg-amber-50/10'
                          : b.status === 'confirmed'
                          ? 'border-emerald-200'
                          : 'border-stone-200'
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {b.id}
                            </span>
                            {b.renterCategory && (
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${RENTER_CATEGORY_PRICING[b.renterCategory]?.badgeClass || 'bg-stone-100 text-stone-700'}`}>
                                {RENTER_CATEGORY_PRICING[b.renterCategory]?.badge || b.renterCategory}
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat?.badgeClass || 'bg-stone-100'}`}>
                              {cat?.label || b.eventCategory}
                            </span>
                          </div>
                          <h3 className="font-bold text-base text-stone-900">
                            {b.eventName}
                          </h3>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {b.status === 'pending' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                              Menunggu Review
                            </span>
                          )}
                          {b.status === 'confirmed' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Terkonfirmasi
                            </span>
                          )}
                          {b.status === 'rejected' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-600" />
                              Ditolak
                            </span>
                          )}
                          {b.status === 'completed' && (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              Acara Selesai
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-4 text-xs">
                        <div>
                          <span className="text-stone-400 block text-[11px]">Jadwal Pelaksanaan:</span>
                          <span className="font-bold text-stone-800 text-sm">
                            {formatIndonesianDate(b.date)}
                          </span>
                          <p className="text-stone-600 text-xs font-semibold mt-0.5">
                            Pemakaian Seharian Penuh (07:30 - 23:00 WITA)
                          </p>
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[11px]">Pemesan & Kontak:</span>
                          <span className="font-bold text-stone-800 text-sm">{b.customerName}</span>
                          <a
                            href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 hover:underline font-semibold block text-xs mt-0.5 flex items-center gap-1"
                          >
                            <PhoneCall className="w-3 h-3" />
                            {b.customerPhone}
                          </a>
                          {b.organization && (
                            <p className="text-stone-500 text-[11px]">Instansi: {b.organization}</p>
                          )}
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[11px]">Keuangan & Pelunasan:</span>
                          <span className="font-extrabold text-stone-900 text-sm block">
                            {formatIDR(b.totalPrice)}
                          </span>
                          <span className="text-amber-800 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>Batas H-3: {formatIndonesianDate(calculatePaymentDeadline(b.date))}</span>
                          </span>
                          <span className="text-stone-500 text-[10px] block mt-0.5">
                            + Sampah DLH: {formatIDR(WASTE_DISPOSAL_FEE)}
                          </span>
                          <div className="mt-1">
                            {b.paymentStatus === 'fully_paid' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                Lunas (100%)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                Belum Lunas (Wajib H-3)
                              </span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-stone-400 block text-[11px]">Catatan Admin:</span>
                          <p className="text-stone-700 italic text-[11px] bg-stone-50 p-2 rounded border border-stone-200">
                            {b.adminNotes || 'Belum ada catatan khusus.'}
                          </p>
                          {b.rejectionReason && (
                            <p className="text-red-700 font-medium text-[10px] mt-1">
                              Alasan Tolak: {b.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Lampiran Surat Permohonan Pemohon */}
                      <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2.5 mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                          <span className="font-bold text-stone-800 text-xs">
                            Berkas Surat Permohonan Pemohon:
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {b.suratPermohonanFile && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 font-semibold text-xs">
                              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span className="truncate max-w-[180px] sm:max-w-xs font-mono text-[11px]">
                                {b.suratPermohonanFile.name}
                              </span>
                              {b.suratPermohonanFile.dataUrl ? (
                                <a
                                  href={b.suratPermohonanFile.dataUrl}
                                  download={b.suratPermohonanFile.name}
                                  className="ml-1 text-emerald-700 hover:text-emerald-900 font-bold underline"
                                  title="Unduh dan buka berkas surat"
                                >
                                  (Unduh)
                                </a>
                              ) : (
                                <span className="text-[10px] text-stone-500 font-normal">
                                  ({Math.round((b.suratPermohonanFile.size || 0) / 1024)} KB)
                                </span>
                              )}
                            </div>
                          )}

                          {b.suratPermohonanUrl && (
                            <a
                              href={b.suratPermohonanUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-900 font-semibold text-xs transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                              <span>Buka Link Google Drive</span>
                            </a>
                          )}

                          {!b.suratPermohonanFile && !b.suratPermohonanUrl && (
                            <span className="text-stone-400 italic text-[11px]">
                              Belum ada berkas surat yang diunggah / dilampirkan pemohon
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Admin Action Buttons Bar */}
                      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {b.status === 'pending' && (
                            <>
                              <button
                                onClick={() =>
                                  onUpdateBookingStatus(
                                    b.id,
                                    'confirmed',
                                    'Disetujui oleh admin UPTD. Tanggal gedung resmi dikunci.'
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Setujui (Approve)</span>
                              </button>

                              <button
                                onClick={() => setRejectingBookingId(b.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs flex items-center gap-1 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Tolak</span>
                              </button>
                            </>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() =>
                                onUpdateBookingStatus(
                                  b.id,
                                  'completed',
                                  'Acara telah selesai terselenggara dengan baik.'
                                )
                              }
                              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-xs"
                            >
                              Tandai Selesai
                            </button>
                          )}

                          {/* Payment status toggle dropdown */}
                          <select
                            value={b.paymentStatus === 'fully_paid' ? 'fully_paid' : 'unpaid'}
                            onChange={(e) =>
                              onUpdatePaymentStatus(b.id, e.target.value as PaymentStatus)
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800 bg-white"
                          >
                            <option value="unpaid">Status: Belum Lunas (Wajib H-3)</option>
                            <option value="fully_paid">Status: Lunas (100%)</option>
                          </select>
                        </div>

                        {/* Secondary utility actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setReschedulingBooking(b);
                              setNewRescheduleDate(b.date);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                            title="Pindah Tanggal"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Reschedule</span>
                          </button>

                          <button
                            onClick={() => onOpenReceipt(b)}
                            className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Kwitansi</span>
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus data booking ${b.id}?`)) {
                                onDeleteBooking(b.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MAINTENANCE & BLOCKED DATES */}
        {activeTab === 'maintenance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Add new blocked date form (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 border-b border-stone-200 pb-3">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-stone-900">
                  Kunci / Blokir Tanggal Gedung
                </h3>
              </div>

              <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                Fitur ini digunakan jika gedung sedang dalam perbaikan fasilitas (AC, atap, sound system) atau ada agenda protokoler kenegaraan/Bupati Tana Toraja. Tanggal yang diblokir tidak dapat dipesan oleh publik.
              </p>

              <form onSubmit={handleAddBlockSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Pilih Tanggal Penutupan / Maintenance:
                  </label>
                  <input
                    type="date"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium text-stone-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Alasan / Keterangan Penutupan:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Perawatan Rutin Sound System & Pengecatan Aula Utama"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-medium text-stone-900"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Kunci Tanggal Ini Sekarang</span>
                </button>
              </form>
            </div>

            {/* List of currently blocked dates (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="text-base font-bold text-stone-900 mb-4 border-b border-stone-200 pb-3 flex items-center justify-between">
                <span>Daftar Tanggal Terkunci / Maintenance</span>
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-bold">
                  {blockedDates.length} Tanggal
                </span>
              </h3>

              {blockedDates.length === 0 ? (
                <p className="text-stone-500 text-xs text-center py-8">
                  Tidak ada tanggal yang sedang dikunci/maintenance.
                </p>
              ) : (
                <div className="space-y-3">
                  {blockedDates.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">
                            {formatIndonesianDate(block.date)}
                          </span>
                          <span className="text-[10px] bg-stone-200 text-stone-800 font-bold px-1.5 py-0.5 rounded uppercase">
                            Ditutup Seharian
                          </span>
                        </div>
                        <p className="text-stone-700 font-medium">
                          {block.reason}
                        </p>
                        <p className="text-stone-400 text-[10px]">
                          Ditetapkan oleh: {block.blockedBy}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveBlockedDate(block.id)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 border border-stone-200 text-[11px] font-semibold transition-colors shrink-0"
                      >
                        Buka Kunci
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS & RECAP */}
        {activeTab === 'reports' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Laporan & Rekapitulasi Pemakaian Gedung
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Laporan resmi penerimaan retribusi & pemakaian fasilitas Gedung Tammuan Mali' Makale.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Laporan Format CSV / Excel</span>
              </button>
            </div>

            {/* Summary statistics table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Permohonan Masuk:</span>
                <span className="text-xl font-bold text-stone-900">{totalBookings} Berkas</span>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs text-emerald-800 block">Total Jadwal Disetujui:</span>
                <span className="text-xl font-bold text-emerald-900">{confirmedBookings.length} Acara</span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-xs text-amber-800 block">Total Retribusi Diterima:</span>
                <span className="text-xl font-bold text-amber-900">{formatIDR(paidRevenue)}</span>
              </div>
            </div>

            {/* Event Category Breakdown */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-stone-100 px-4 py-3 font-bold text-stone-800 border-b border-stone-200">
                Distribusi Acara Berdasarkan Kategori
              </div>
              <div className="divide-y divide-stone-200">
                {Object.entries(EVENT_CATEGORY_LABELS).map(([catKey, info]) => {
                  const count = bookings.filter((b) => b.eventCategory === catKey).length;
                  return (
                    <div key={catKey} className="px-4 py-2.5 flex items-center justify-between">
                      <span className="text-stone-700 font-medium">{info.label}</span>
                      <span className="font-bold text-stone-900">{count} Acara</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Reject Reason Modal */}
      {rejectingBookingId && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              Tolak Permohonan Reservasi
            </h3>
            <p className="text-xs text-stone-600">
              Silakan tuliskan alasan penolakan untuk disampaikan kepada pemohon:
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Contoh: Jadwal bertabrakan dengan agenda rapat koordinasi Pemda Tana Toraja."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs font-medium text-stone-900 focus:ring-2 focus:ring-red-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectingBookingId(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Tolak Reservasi Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h3 className="font-bold text-base text-stone-900">
              Reschedule Tanggal Acara: {reschedulingBooking.eventName}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Pilih Tanggal Baru:
                </label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 font-medium"
                  required
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Tanggal Baru: {formatIndonesianDate(newRescheduleDate)} (Seharian Penuh)
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => setReschedulingBooking(null)}
                className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold"
              >
                Simpan Perubahan Tanggal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
