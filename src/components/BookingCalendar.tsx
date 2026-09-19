import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  Landmark,
  CalendarCheck2,
  Sparkles,
  Info
} from 'lucide-react';
import { Booking, BlockedDate } from '../types';
import { EVENT_CATEGORY_LABELS, DAILY_RENTAL_PRICE } from '../data/constants';
import { 
  formatIndonesianDate, 
  formatIDR, 
  checkDateAvailability 
} from '../utils/dateUtils';

interface BookingCalendarProps {
  bookings: Booking[];
  blockedDates: BlockedDate[];
  onSelectDate: (dateStr: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  blockedDates,
  onSelectDate,
}) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split('T')[0]
  );

  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const dayNamesIndo = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleResetToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Generate calendar matrix
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells: Array<{
    dateStr: string;
    dayNumber: number;
    isCurrentMonth: boolean;
  }> = [];

  // Previous month padding
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: day, isCurrentMonth: false });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: day, isCurrentMonth: true });
  }

  // Next month padding to complete 42 grid
  const remainingCells = 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ dateStr, dayNumber: day, isCurrentMonth: false });
  }

  const selectedDateAvail = checkDateAvailability(selectedDate, bookings, blockedDates);
  const todayStr = today.toISOString().split('T')[0];

  return (
    <section id="kalender" className="scroll-mt-24 space-y-6">
      {/* Title & Legend Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold mb-2 border border-amber-500/20">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-700" />
            <span>Kalender Otomatis Gedung Tammuan Mali'</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            Jadwal & Ketersediaan Tanggal
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Reservasi gedung berlaku per tanggal (seharian penuh). Pilih tanggal kosong untuk langsung melakukan reservasi secara otomatis.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 shadow-xs"></span>
            <span className="text-stone-700">Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-red-500 shadow-xs"></span>
            <span className="text-stone-700">Sudah Terisi (Booked)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md bg-stone-400 border border-stone-500 border-dashed"></span>
            <span className="text-stone-700">Pemeliharaan / Tutup</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-sm p-4 sm:p-6">
          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-stone-900">
                {monthNamesIndo[currentMonth]} {currentYear}
              </h3>
              <button
                onClick={handleResetToToday}
                className="text-xs px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors"
              >
                Hari Ini
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-calendar-prev"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200"
                aria-label="Bulan Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                id="btn-calendar-next"
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200"
                aria-label="Bulan Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">
            {dayNamesIndo.map((day, idx) => (
              <div key={day} className={`py-1.5 ${idx === 0 ? 'text-red-500' : ''}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell) => {
              const avail = checkDateAvailability(cell.dateStr, bookings, blockedDates);
              const isSelected = selectedDate === cell.dateStr;
              const isToday = cell.dateStr === todayStr;

              let cellStyle = 'bg-emerald-50/50 hover:bg-emerald-100/50 border-emerald-200 text-emerald-950';
              let badgeColor = 'bg-emerald-500';

              if (avail.status === 'past') {
                cellStyle = 'bg-stone-100/60 text-stone-400 border-stone-200 opacity-60 cursor-not-allowed';
                badgeColor = 'bg-stone-300';
              } else if (avail.status === 'blocked') {
                cellStyle = 'bg-stone-100 text-stone-600 border-stone-300 border-dashed';
                badgeColor = 'bg-stone-500';
              } else if (avail.status === 'booked') {
                cellStyle = 'bg-red-50/80 text-red-950 border-red-200';
                badgeColor = 'bg-red-500';
              }

              if (!cell.isCurrentMonth) {
                cellStyle += ' opacity-40';
              }

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 relative ${cellStyle} ${
                    isSelected
                      ? 'ring-2 ring-amber-600 ring-offset-1 border-amber-600 shadow-md font-semibold z-10'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs sm:text-sm font-semibold rounded-md w-6 h-6 flex items-center justify-center ${
                        isToday
                          ? 'bg-amber-600 text-white font-bold'
                          : cell.isCurrentMonth
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.isCurrentMonth && avail.status !== 'past' && (
                      <span className={`w-2 h-2 rounded-full ${badgeColor}`} />
                    )}
                  </div>

                  {/* Day Content Tag */}
                  <div className="w-full mt-1 overflow-hidden">
                    {avail.status === 'booked' && avail.booking ? (
                      <div className="text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded bg-white/90 border border-red-200 text-red-800 font-medium">
                        {avail.booking.eventName}
                      </div>
                    ) : avail.status === 'blocked' ? (
                      <div className="text-[9px] sm:text-[10px] truncate px-1 py-0.5 rounded bg-stone-200 text-stone-700 flex items-center gap-1">
                        <Wrench className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">Tutup</span>
                      </div>
                    ) : cell.isCurrentMonth && avail.status === 'available' ? (
                      <span className="text-[10px] text-emerald-700 font-semibold hidden sm:inline-block">
                        Bebas / Kosong
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div>
              {/* Header Date Info */}
              <div className="border-b border-stone-200 pb-4 mb-4">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                  Status Tanggal Terpilih:
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {formatIndonesianDate(selectedDate)}
                </h3>

                {/* Status Pill */}
                <div className="mt-3">
                  {selectedDateAvail.status === 'past' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
                      <Clock className="w-3.5 h-3.5" />
                      Tanggal Telah Berlalu
                    </span>
                  ) : selectedDateAvail.status === 'blocked' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-200 text-stone-800">
                      <Wrench className="w-3.5 h-3.5 text-stone-600" />
                      Gedung Ditutup / Pemeliharaan
                    </span>
                  ) : selectedDateAvail.status === 'booked' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      Tanggal Telah Dipesan (Terisi)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Gedung Tersedia (Bebas Booking)
                    </span>
                  )}
                </div>
              </div>

              {/* Status Specific Details */}
              {selectedDateAvail.status === 'available' && (
                <div className="space-y-3 text-xs text-stone-600">
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-900 text-sm">
                      <span>Tarif Sewa Harian:</span>
                      <span className="text-base text-amber-800">{formatIDR(DAILY_RENTAL_PRICE)}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Pemakaian gedung seharian penuh (07.30 - 23.00 WITA), termasuk auditorium utama, panggung megah, 2 ruang rias pengantin ber-AC, dan area parkir luas.
                    </p>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] space-y-1">
                    <p className="font-semibold text-stone-800">Keuntungan Booking Langsung:</p>
                    <p>• Jadwal otomatis terkunci di sistem Pemkab Tana Toraja</p>
                    <p>• Diterbitkan bukti registrasi & kwitansi resmi langsung</p>
                    <p>• DP ringan (minimal 30%) untuk konfirmasi awal</p>
                  </div>
                </div>
              )}

              {selectedDateAvail.status === 'booked' && selectedDateAvail.booking && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-red-900">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Jadwal Tidak Tersedia</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-700 block">Acara Terdaftar:</span>
                      <span className="font-bold text-stone-900 text-sm block">
                        {selectedDateAvail.booking.eventName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-red-700 block">Penyelenggara:</span>
                      <span className="font-semibold text-stone-800">
                        {selectedDateAvail.booking.organization || selectedDateAvail.booking.customerName}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 italic text-center">
                    Silakan pilih tanggal lain yang masih bertanda hijau pada kalender.
                  </p>
                </div>
              )}

              {selectedDateAvail.status === 'blocked' && selectedDateAvail.blocked && (
                <div className="p-4 rounded-xl bg-stone-100 border border-stone-300 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Wrench className="w-4 h-4 text-stone-600" />
                    <span>Catatan Penutupan:</span>
                  </div>
                  <p className="text-stone-700 font-medium">{selectedDateAvail.blocked.reason}</p>
                  <p className="text-[11px] text-stone-500">
                    Ditetapkan oleh: {selectedDateAvail.blocked.blockedBy}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action Button */}
            <div className="mt-6 pt-4 border-t border-stone-200">
              <button
                id="btn-calendar-book-now"
                disabled={!selectedDateAvail.isAvailable}
                onClick={() => onSelectDate(selectedDate)}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                  selectedDateAvail.isAvailable
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-amber-900/20'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>
                  {selectedDateAvail.isAvailable
                    ? 'Booking Gedung untuk Tanggal Ini'
                    : 'Tanggal Tidak Dapat Dipilih'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
