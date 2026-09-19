import React from 'react';
import { 
  Building,
  Armchair,
  Users,
  Car, 
  Sparkles, 
  Zap, 
  Wind, 
  MapPin, 
  CheckCircle2, 
  Calendar,
  Clock,
  Coins,
  Shield,
  ArrowRight,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { FACILITY_ADDONS, HALL_INFO, DAILY_RENTAL_PRICE, RENTER_CATEGORY_PRICING, WASTE_DISPOSAL_FEE, WASTE_DISPOSAL_NOTE } from '../data/constants';
import { formatIDR } from '../utils/dateUtils';

interface HallOverviewProps {
  onOpenBooking: () => void;
  onNavigateToCalendar: () => void;
}

export const HallOverview: React.FC<HallOverviewProps> = ({
  onOpenBooking,
  onNavigateToCalendar,
}) => {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section id="beranda" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 border border-stone-800 text-stone-100 shadow-2xl p-6 sm:p-10 lg:p-14">
        {/* Background Decorative Toraja-inspired Motif Glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-red-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tempat Ternyaman Untuk Setiap Kegiatan</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Gedung Pertemuan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              TAMMUAN MALI' MAKALE
            </span>
          </h1>

          <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed mb-8">
            Pusat perhelatan termegah di jantung Kota Makale. Tempat ideal untuk Pesta Adat 
            <strong className="text-amber-300 font-semibold"> Rambu Tuka'</strong>, Resepsi Pernikahan, 
            Wisuda Akbar, Ibadah Oikumene, hingga Seminar & Rapat Kedinasan Pemerintah Kabupaten Tana Toraja.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              id="btn-hero-booking"
              onClick={onOpenBooking}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-900/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              <span>Reservasi Gedung Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-check-calendar"
              onClick={onNavigateToCalendar}
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-sm sm:text-base border border-stone-700 flex items-center gap-2 transition-all"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Lihat Kalender Tanggal Kosong</span>
            </button>
          </div>

          {/* Key Facts Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Kapasitas Tamu</p>
                <p className="text-sm font-bold text-white">s/d 2.500 Orang</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Area Parkir</p>
                <p className="text-sm font-bold text-white">120+ Mobil & Bus</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Model Booking</p>
                <p className="text-sm font-bold text-white">Sewa Harian Penuh</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-400">Lokasi Gedung</p>
                <p className="text-sm font-bold text-white">Pusat Makale</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Fasilitas Unggulan Gedung */}
      <section id="fasilitas" className="space-y-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5 text-amber-700" />
            <span>Fasilitas Gedung Tammuan Mali'</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Fasilitas Gedung
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1">
            Fasilitas utama yang disediakan oleh pengelola Gedung Pertemuan Tammuan Mali' Makale untuk penyelenggaraan acara Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 1. Main Hall */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Building className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  Fasilitas 1
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                  1. Main Hall & AC Standing
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Aula pertemuan utama yang luas dan representatif dengan panggung ornamen ukiran Pa'tedong khas Toraja yang agung, serta sudah dilengkapi paket pendingin udara 4 unit AC Standing 5 PK yang sudah termasuk dalam paket gedung untuk menjamin kenyamanan seluruh tamu.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  Karakteristik & Keunggulan:
                </p>
                <ul className="text-xs sm:text-sm text-stone-600 space-y-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ruang auditorium utama berkapasitas besar hingga 2.500 orang</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span><strong>Sudah Include:</strong> 4 unit AC Standing 5 PK untuk pendingin udara sejuk</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Panggung utama luas (18m x 7m) bernuansa ornamen khas Toraja</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Akses masuk dan keluar yang representatif di pusat kota Makale</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold bg-amber-50/60 p-3 rounded-xl">
              <span>Termasuk dalam Paket Sewa Standar</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Siap Digunakan
              </span>
            </div>
          </div>

          {/* Card 2: 2. Kursi Futura 500 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Armchair className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  Fasilitas 2
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                  2. Kursi Futura 500
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  Tersedia 500 unit kursi Futura berkualitas, kokoh dengan bantalan busa empuk dan sandaran nyaman untuk kenyamanan seluruh tamu (tanpa sarung kursi, sarung kursi disediakan mandiri oleh penyewa/pihak dekorasi).
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  Karakteristik & Keunggulan:
                </p>
                <ul className="text-xs sm:text-sm text-stone-600 space-y-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>500 unit kursi Futura siap pakai untuk para tamu</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Rangka pipa chrome kokoh dengan dudukan & sandaran busa empuk</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Fleksibel ditata untuk format theater, round-table, maupun seminar</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Kondisi terawat & bersih (tidak include sarung kursi / cover)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-amber-900 font-semibold bg-amber-50/60 p-3 rounded-xl">
              <span>Termasuk dalam Paket Sewa Standar</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 500 Unit Standby
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tarif Sewa Harian Resmi */}
      <section className="bg-stone-50 rounded-3xl p-6 sm:p-10 border border-stone-200">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5 text-amber-700" />
            <span>Transparansi Tarif Retribusi Daerah</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Tarif Sewa Gedung Harian Resmi
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-1">
            Reservasi gedung diberlakukan per tanggal (seharian penuh) sehingga Anda leluasa mendekorasi dan menyelenggarakan acara dari pagi hingga malam hari tanpa batas sesi.
          </p>
        </div>

        {/* Featured Daily Rental Card & Category Rates */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-10 border-2 border-amber-500/80 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-extrabold uppercase tracking-wider shadow">
                  <span>Paket Pemakaian Seharian Penuh (Full Day: 07:30 - 23:00 WITA)</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Tarif Resmi Sewa Gedung Berdasarkan Kategori Penyewa
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  Pemerintah UPTD menetapkan perbedaan tarif sewa gedung berdasarkan kategori pemohon/penyewa guna mendukung kegiatan kemasyarakatan dan pembinaan keagamaan di Kabupaten Tana Toraja.
                </p>

                {/* 3 Kategori Kartu Tarif */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {/* Keagamaan */}
                  <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Keagamaan
                    </span>
                    <div className="text-2xl font-black text-white">
                      {formatIDR(RENTER_CATEGORY_PRICING.keagamaan.price)}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Ibadah Raya, Natal, Paskah, Retret, & Acara Lembaga Keagamaan
                    </p>
                  </div>

                  {/* Ormas */}
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/40 space-y-1.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Ormas
                    </span>
                    <div className="text-2xl font-black text-white">
                      {formatIDR(RENTER_CATEGORY_PRICING.ormas.price)}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Organisasi Kemasyarakatan, LSM, Paguyuban, & Kepemudaan
                    </p>
                  </div>

                  {/* Umum */}
                  <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 space-y-1.5 ring-1 ring-amber-500/30">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Umum
                    </span>
                    <div className="text-2xl font-black text-amber-300">
                      {formatIDR(RENTER_CATEGORY_PRICING.umum.price)}
                    </div>
                    <p className="text-[11px] text-stone-300 leading-snug">
                      Pernikahan, Rambu Tuka', Wisuda, Rapat, Konser, & Komersial
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 text-xs text-stone-200">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>1. Main Hall & AC Standing:</strong> Termasuk 4 Unit AC 5 PK</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>2. Kursi Futura:</strong> 500 Unit Kursi Siap Pakai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Pemakaian Seharian Penuh (07:30 - 23:00 WITA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Akses Strategis di Kawasan Kolam Makale</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-stone-900/90 rounded-2xl p-6 border border-stone-700/60 space-y-4">
                <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider">
                  Ketentuan Booking & Pelunasan (H-3)
                </h4>
                <ul className="text-xs text-stone-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Tanpa Uang Muka (DP):</strong> Reservasi tanggal dapat langsung diajukan tanpa perlu membayar DP di awal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Pelunasan Minimal H-3:</strong> Pelunasan penuh biaya sewa gedung wajib diselesaikan minimal <strong>H-3 sebelum hari kegiatan</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Bukti pendaftaran dan kuitansi resmi terbit otomatis dengan rincian jadwal dan rekening kas daerah.</span>
                  </li>
                  <li className="flex items-start gap-2 pt-1 border-t border-stone-800 text-amber-200/90">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Ketentuan Sampah:</strong> Tarif gedung belum termasuk retribusi angkut sampah sebesar <strong>{formatIDR(WASTE_DISPOSAL_FEE)}</strong> ke DLH. Setiap penanggung jawab kegiatan wajib <strong>mengumpulkan sampah pasca acara ke dalam kantong plastik hitam</strong> yang disiapkan sendiri.</span>
                  </li>
                </ul>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Pesan Tanggal Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fasilitas Tambahan (Add-ons) preview */}
        <div className="mt-10 pt-8 border-t border-stone-200">
          <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Fasilitas Tambahan yang Dapat Dipilih Saat Booking:</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FACILITY_ADDONS.map((addon) => (
              <div
                key={addon.id}
                className="bg-white p-3.5 rounded-xl border border-stone-200 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-stone-900">{addon.name}</p>
                  <p className="text-stone-500 line-clamp-1 mt-0.5">{addon.description}</p>
                </div>
                <span className="font-bold text-amber-700 whitespace-nowrap bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  +{formatIDR(addon.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alur Booking Otomatis Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-900/40">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 text-amber-200 text-center">
          Alur Reservasi Online Gedung Tammuan Mali'
        </h2>
        <p className="text-stone-300 text-xs sm:text-sm text-center max-w-2xl mx-auto mb-8">
          Proses pemesanan transparan, otomatis terintegrasi dengan kalender pemda, dan dapat dicek statusnya kapan saja.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Pilih Tanggal Acara</h4>
            <p className="text-[11px] text-stone-400">
              Lihat tanggal hijau di kalender otomatis yang belum terisi acara lain.
            </p>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Isi Formulir & Surat Permohonan</h4>
            <p className="text-[11px] text-stone-400">
              Lengkapi data acara dan lampirkan Surat Permohonan (via upload berkas atau link Google Drive).
            </p>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Terima Tanda Bukti & Pelunasan H-3</h4>
            <p className="text-[11px] text-stone-400">
              Dapatkan nomor registrasi resmi tanpa uang muka. Lakukan pelunasan paling lambat H-3 sebelum acara.
            </p>
          </div>

          <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center mx-auto text-sm">
              4
            </div>
            <h4 className="font-bold text-stone-100 text-xs sm:text-sm">Persetujuan & Kunci Jadwal</h4>
            <p className="text-[11px] text-stone-400">
              Admin memverifikasi berkas dan tanggal otomatis terkunci resmi di kalender dinas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
