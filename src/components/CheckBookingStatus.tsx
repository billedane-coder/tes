import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Printer, 
  FileText, 
  ExternalLink, 
  Download, 
  FileCheck,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Booking } from '../types';
import { EVENT_CATEGORY_LABELS, RENTER_CATEGORY_PRICING, WASTE_DISPOSAL_FEE } from '../data/constants';
import { formatIDR, formatIndonesianDate, calculatePaymentDeadline } from '../utils/dateUtils';

interface CheckBookingStatusProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  onOpenReceipt: (booking: Booking) => void;
}

export const CheckBookingStatus: React.FC<CheckBookingStatusProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenReceipt,
}) => {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [foundBookings, setFoundBookings] = useState<Booking[]>([]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return;

    const results = bookings.filter(
      (b) =>
        b.id.toLowerCase().includes(cleanQuery) ||
        b.customerPhone.toLowerCase().includes(cleanQuery) ||
        b.customerName.toLowerCase().includes(cleanQuery)
    );

    setFoundBookings(results);
    setHasSearched(true);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Terkonfirmasi (Disetujui)
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Menunggu Verifikasi Admin
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Reservasi Ditolak / Dibatalkan
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Acara Selesai
          </span>
        );
    }
  };

  const getPaymentBadge = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'fully_paid':
        return <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Lunas (100%)</span>;
      case 'dp_paid':
      case 'unpaid':
      default:
        return <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Menunggu Pelunasan (H-3)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-amber-900/40">
          <div>
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block mb-0.5">
              Layanan Mandiri Pemohon
            </span>
            <h2 className="text-xl font-bold">Cek Status Reservasi Gedung</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Masukkan Kode Booking atau Nomor WhatsApp:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Contoh: TM-202609-001 atau 0812..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 text-sm font-medium text-stone-900"
                  required
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                Cari Status
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Tips: Coba cari dengan kode registrasi awal <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-800 font-mono font-bold">TM-2026</code> atau nama Anda.
            </p>
          </form>

          {/* Search Results */}
          {!hasSearched ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p>Masukkan kode booking Anda untuk melihat status approval jadwal dan kwitansi.</p>
            </div>
          ) : foundBookings.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-stone-200 p-6">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-600 mb-2" />
              <p className="font-bold text-stone-900 text-sm">Data Reservasi Tidak Ditemukan</p>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                Pastikan kode booking atau nomor telepon yang Anda masukkan sudah sesuai. Jika butuh bantuan, hubungi pengelola di 0821-9087-4321.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs font-semibold text-stone-500">
                Ditemukan {foundBookings.length} data reservasi:
              </p>

              {foundBookings.map((b) => {
                const cat = EVENT_CATEGORY_LABELS[b.eventCategory];

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {b.id}
                          </span>
                          {b.renterCategory && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RENTER_CATEGORY_PRICING[b.renterCategory]?.badgeClass || 'bg-stone-100 text-stone-700'}`}>
                              {RENTER_CATEGORY_PRICING[b.renterCategory]?.badge || b.renterCategory}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-stone-900 mt-1">
                          {b.eventName}
                        </h3>
                      </div>
                      <div>{getStatusBadge(b.status)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Tanggal Acara:</span>
                        <span className="font-bold text-stone-800">
                          {formatIndonesianDate(b.date)}
                        </span>
                        <p className="text-stone-600 text-[11px]">
                          Pemakaian Seharian Penuh (07:30 - 23:00 WITA)
                        </p>
                        <p className="text-amber-800 text-[10px] font-medium">
                          Fasilitas: 1. Main Hall (+ 4 AC Standing), 2. Kursi Futura 500
                        </p>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Penanggung Jawab:</span>
                        <span className="font-bold text-stone-800">{b.customerName}</span>
                        <p className="text-stone-500 text-[11px]">{b.customerPhone}</p>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Status Pembayaran:</span>
                        <div className="mt-0.5">{getPaymentBadge(b.paymentStatus)}</div>
                      </div>

                      <div>
                        <span className="text-stone-400 block text-[11px]">Total Biaya Sewa:</span>
                        <span className="font-extrabold text-stone-900 text-sm">
                          {formatIDR(b.totalPrice)}
                        </span>
                        <p className="text-amber-800 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Batas H-3: {formatIndonesianDate(calculatePaymentDeadline(b.date))}</span>
                        </p>
                        <p className="text-stone-500 text-[10px] mt-0.5 leading-snug">
                          *Belum termasuk retribusi sampah {formatIDR(WASTE_DISPOSAL_FEE)} ke DLH & pemohon wajib mengumpulkan sampah ke kantong plastik hitam mandiri.
                        </p>
                      </div>
                    </div>

                    {/* Lampiran Surat Permohonan */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                      <span className="font-bold text-stone-700 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Berkas Surat Permohonan:</span>
                      </span>

                      {b.suratPermohonanFile || b.suratPermohonanUrl ? (
                        <div className="flex flex-wrap gap-2 pt-0.5">
                          {b.suratPermohonanFile && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[11px] text-emerald-900 font-medium">
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="truncate max-w-[150px] sm:max-w-xs">{b.suratPermohonanFile.name}</span>
                              {b.suratPermohonanFile.dataUrl && (
                                <a
                                  href={b.suratPermohonanFile.dataUrl}
                                  download={b.suratPermohonanFile.name}
                                  className="ml-1 text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
                                  title="Unduh file"
                                >
                                  (Unduh)
                                </a>
                              )}
                            </div>
                          )}

                          {b.suratPermohonanUrl && (
                            <a
                              href={b.suratPermohonanUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] text-amber-900 font-medium hover:bg-amber-50 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                              <span>Buka Link Dokumen</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">
                          Belum dilampirkan via online (dapat diserahkan langsung ke UPTD).
                        </span>
                      )}
                    </div>

                    {b.adminNotes && (
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700">
                        <strong className="text-stone-900">Catatan Petugas UPTD:</strong> {b.adminNotes}
                      </div>
                    )}

                    {b.rejectionReason && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
                        <strong className="text-red-900">Alasan Penolakan:</strong> {b.rejectionReason}
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => onOpenReceipt(b)}
                        className="px-3.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-stone-600" />
                        <span>Buka Kwitansi / Tanda Bukti</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
