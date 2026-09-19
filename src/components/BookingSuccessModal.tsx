import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  MessageCircle, 
  Copy, 
  Calendar, 
  User, 
  Phone, 
  QrCode, 
  Landmark,
  ShieldCheck,
  FileText,
  Download,
  ExternalLink,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Booking } from '../types';
import { FACILITY_ADDONS, BANK_ACCOUNTS, HALL_INFO, RENTER_CATEGORY_PRICING, WASTE_DISPOSAL_FEE, WASTE_DISPOSAL_NOTE, WASTE_COLLECTION_NOTE } from '../data/constants';
import { formatIDR, formatIndonesianDate, calculatePaymentDeadline } from '../utils/dateUtils';

interface BookingSuccessModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !booking) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(booking.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const paymentDeadline = calculatePaymentDeadline(booking.date);

  // WhatsApp confirmation URL
  const waMessage = encodeURIComponent(
    `Halo Pengelola Gedung Tammuan Mali' Makale,\n\nSaya ingin konfirmasi reservasi pemakaian gedung dengan rincian sbb:\n\n• Kode Booking: ${booking.id}\n• Nama Pemesan: ${booking.customerName}\n• Acara: ${booking.eventName}\n• Tanggal: ${formatIndonesianDate(booking.date)} (Seharian Penuh)\n• Total Biaya Sewa: ${formatIDR(booking.totalPrice)}\n• Ketentuan: Tanpa Uang Muka (DP)\n• Batas Pelunasan: Maksimal H-3 (${formatIndonesianDate(paymentDeadline)})\n• Catatan: Biaya gedung belum termasuk retribusi angkut sampah ${formatIDR(WASTE_DISPOSAL_FEE)} ke Dinas Lingkungan Hidup (DLH)\n\nMohon informasi verifikasi berkas dan jadwal. Terima kasih!`
  );
  const waUrl = `https://wa.me/${HALL_INFO.whatsapp}?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-emerald-200 text-xs font-semibold uppercase tracking-wider block">
                Reservasi Berhasil Diajukan
              </span>
              <h2 className="text-lg sm:text-xl font-bold">
                Tanda Bukti Registrasi Gedung
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Booking Code Banner */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                Kode Registrasi Booking Anda:
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-stone-900 tracking-wider">
                {booking.id}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-amber-700" />
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          {/* Official Letterhead Header for Print */}
          <div className="border-b-2 border-stone-800 pb-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Landmark className="w-6 h-6 text-amber-700" />
              <h3 className="font-black text-stone-900 text-base sm:text-lg tracking-wide uppercase">
                UPTD PENGELOLA GEDUNG TAMMUAN MALI'
              </h3>
            </div>
            <p className="text-xs text-stone-600 font-medium">
              Jl. Tritura No. 1, Bombongan, Kec. Makale, Kabupaten Tana Toraja, Sulawesi Selatan
            </p>
            <p className="text-[11px] text-stone-500">
              Surat Tanda Terima Registrasi Pemakaian Gedung Pertemuan & Fasilitas
            </p>
          </div>

          {/* Booking Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-stone-500 text-xs block">Nama Pemesan / Penanggung Jawab:</span>
              <span className="font-bold text-stone-900 text-sm sm:text-base">
                {booking.customerName}
              </span>
              {booking.organization && (
                <p className="text-xs text-stone-600 font-medium">({booking.organization})</p>
              )}
            </div>

            <div>
              <span className="text-stone-500 text-xs block">Nomor WhatsApp / HP:</span>
              <span className="font-semibold text-stone-900">{booking.customerPhone}</span>
            </div>

            <div>
              <span className="text-stone-500 text-xs block">Nama Acara / Kegiatan:</span>
              <span className="font-bold text-stone-900">{booking.eventName}</span>
              <div className="flex items-center gap-2 mt-1">
                {booking.renterCategory && (
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${RENTER_CATEGORY_PRICING[booking.renterCategory]?.badgeClass || 'bg-stone-100 text-stone-700'}`}>
                    Kategori {RENTER_CATEGORY_PRICING[booking.renterCategory]?.name || booking.renterCategory}
                  </span>
                )}
                <span className="text-stone-500 text-[11px]">Tamu: {booking.estimatedGuests} orang</span>
              </div>
            </div>

            <div>
              <span className="text-stone-500 text-xs block">Tanggal Pelaksanaan Acara:</span>
              <span className="font-bold text-amber-800 text-sm">
                {formatIndonesianDate(booking.date)}
              </span>
              <p className="text-stone-700 text-xs font-semibold mt-0.5">
                Pemakaian Gedung Seharian Penuh (07:30 - 23:00 WITA)
              </p>
              <p className="text-amber-800 text-[11px] font-medium mt-0.5">
                Fasilitas Utama: 1. Main Hall (+ 4 Unit AC Standing 5 PK), 2. Kursi Futura 500 Unit
              </p>
            </div>
          </div>

          {/* Add-ons list if any */}
          {booking.addons.length > 0 && (
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs">
              <span className="font-semibold text-stone-700 block mb-1.5">
                Fasilitas Tambahan Terdaftar:
              </span>
              <div className="space-y-1">
                {booking.addons.map((add) => {
                  const info = FACILITY_ADDONS.find((a) => a.id === add.addonId);
                  if (!info) return null;
                  return (
                    <div key={add.addonId} className="flex justify-between text-stone-700">
                      <span>• {info.name} (x{add.quantity})</span>
                      <span className="font-semibold">{formatIDR(info.price * add.quantity)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Lampiran Surat Permohonan Pemakaian Gedung */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Berkas Surat Permohonan Pemakaian Gedung:</span>
            </span>

            {booking.suratPermohonanFile || booking.suratPermohonanUrl ? (
              <div className="space-y-2 pt-1">
                {booking.suratPermohonanFile && (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-2 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-stone-900 truncate">
                          {booking.suratPermohonanFile.name}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Berkas Terunggah ({Math.round(booking.suratPermohonanFile.size / 1024)} KB)
                        </p>
                      </div>
                    </div>
                    {booking.suratPermohonanFile.dataUrl && (
                      <a
                        href={booking.suratPermohonanFile.dataUrl}
                        download={booking.suratPermohonanFile.name}
                        className="px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh</span>
                      </a>
                    )}
                  </div>
                )}

                {booking.suratPermohonanUrl && (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200">
                    <div className="flex items-center gap-2 truncate">
                      <ExternalLink className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="truncate">
                        <p className="font-bold text-stone-900">Tautan Dokumen Cloud / Google Drive</p>
                        <p className="text-[10px] text-amber-700 truncate max-w-xs">
                          {booking.suratPermohonanUrl}
                        </p>
                      </div>
                    </div>
                    <a
                      href={booking.suratPermohonanUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] flex items-center gap-1 shrink-0 ml-2 transition-colors"
                    >
                      <span>Buka Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-stone-500 italic text-[11px]">
                Belum dilampirkan secara online. Anda dapat membawa fisik Surat Permohonan resmi atau mengirimkannya saat verifikasi dengan pengelola.
              </p>
            )}
          </div>

          {/* Pricing Breakdown & Payment Terms */}
          <div className="bg-stone-100/70 p-4 rounded-xl space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Tarif Sewa Gedung ({booking.renterCategory ? RENTER_CATEGORY_PRICING[booking.renterCategory]?.name : 'Tarif Pokok'}):</span>
              <span className="font-semibold text-stone-900">{formatIDR(booking.basePrice)}</span>
            </div>

            {booking.addons && booking.addons.length > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Fasilitas Tambahan Terpilih:</span>
                <span className="font-semibold text-stone-900">+{formatIDR(booking.totalPrice - booking.basePrice)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-900 font-bold border-t border-stone-300/60 pt-2">
              <span>Total Biaya Sewa Gedung:</span>
              <span className="font-extrabold text-stone-900 text-base">{formatIDR(booking.totalPrice)}</span>
            </div>

            {/* Catatan Biaya Sampah DLH & Sampah Plastik Hitam */}
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-stone-700 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed space-y-1">
                <div>
                  <span className="font-bold text-amber-950">Catatan Retribusi Kebersihan: </span>
                  <span>
                    Biaya sewa gedung di atas <strong>belum termasuk biaya angkut sampah sebesar {formatIDR(WASTE_DISPOSAL_FEE)}</strong> yang dibayarkan ke <strong>Dinas Lingkungan Hidup (DLH)</strong>.
                  </span>
                </div>
                <div className="pt-1 border-t border-amber-200/70 text-amber-950">
                  <span className="font-bold">Kewajiban Pasca Kegiatan: </span>
                  <span>
                    Penanggung jawab kegiatan wajib <strong>mengumpulkan seluruh sampah ke dalam kantong plastik hitam</strong> yang disiapkan secara mandiri.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-amber-900 border-t border-stone-300 pt-2 text-xs">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Ketentuan Pembayaran:
              </span>
              <span className="font-bold bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                Tanpa Uang Muka (Tanpa DP)
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-700 text-xs">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Batas Akhir Pelunasan (H-3):
              </span>
              <span className="font-bold text-amber-900">
                {formatIndonesianDate(paymentDeadline)}
              </span>
            </div>
            <div className="flex justify-between items-center text-stone-500 text-xs pt-1 border-t border-stone-200">
              <span>Status Pembayaran:</span>
              <span className="font-semibold uppercase text-stone-700">
                {booking.paymentStatus === 'fully_paid' ? (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Lunas (100%)
                  </span>
                ) : (
                  <span className="text-stone-700 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                    Belum Lunas (Wajib Pelunasan H-3)
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Official Bank Account for Full Payment */}
          <div className="border border-stone-200 rounded-2xl p-4 space-y-2.5 bg-amber-50/40">
            <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Instruksi Pelunasan Biaya Sewa Gedung:</span>
            </p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Pelunasan penuh senilai <strong>{formatIDR(booking.totalPrice)}</strong> wajib dilakukan paling lambat <strong>H-3 kegiatan ({formatIndonesianDate(paymentDeadline)})</strong> ke rekening resmi kas pengelola:
            </p>
            <div className="p-3 bg-white rounded-xl border border-amber-200">
              <p className="font-bold text-stone-900 text-xs">Bank Sulselbar (Kas UPTD Tammuan Mali)</p>
              <p className="font-mono text-base font-black text-amber-800 tracking-wider select-all">
                110-003-000892-1
              </p>
              <p className="text-[10px] text-stone-500">
                Atas Nama: UPTD Pengelola Gedung Tammuan Mali Tana Toraja
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/80 border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Tidak ada biaya uang muka yang ditagihkan saat ini. Simpan bukti pemesanan ini dan selesaikan pelunasan sebelum batas waktu H-3.
              </span>
            </div>
          </div>

          {/* Footer note & Stamp Placeholder */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-400">
            <div>
              <p>Diterbitkan secara digital oleh Sistem Informasi Gedung Tammuan Mali'.</p>
              <p>Makale, Tana Toraja, Sulawesi Selatan.</p>
            </div>
            <div className="text-center font-mono text-[9px] border border-stone-300 p-2 rounded">
              <span>TERVERIFIKASI</span>
              <br />
              <span>UPTD MAKALE</span>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Cetak Tanda Bukti (PDF)</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konfirmasi via WhatsApp</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
