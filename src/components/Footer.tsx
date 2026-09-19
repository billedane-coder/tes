import React from 'react';
import { Landmark, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { HALL_INFO } from '../data/constants';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenCheckStatus: () => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBooking,
  onOpenCheckStatus,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminDashboard,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-stone-950 shadow-md">
                <Landmark className="w-5 h-5 text-amber-100" />
              </div>
              <div>
                <span className="font-extrabold text-base text-amber-200 tracking-wide block">
                  TAMMUAN MALI'
                </span>
                <span className="text-[11px] text-stone-400">
                  Makale, Tana Toraja
                </span>
              </div>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Gedung serbaguna dan konvensi resmi Pemerintah Kabupaten Tana Toraja untuk pernikahan adat Toraja (Rambu Tuka'), wisuda, ibadah akbar, dan seminar nasional.
            </p>
          </div>

          {/* Location & Landmark */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Lokasi Gedung
            </h4>
            <div className="flex items-start gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{HALL_INFO.address}</span>
            </div>
            <p className="text-[11px] text-stone-500 pl-6">
              {HALL_INFO.landmark}
            </p>
          </div>

          {/* Operational & Contact */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Kontak Layanan
            </h4>
            <div className="flex items-center gap-2 text-stone-400">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{HALL_INFO.phone} (WhatsApp/Telp)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">{HALL_INFO.email}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Jam Operasional: {HALL_INFO.operatingHours}</span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
              Layanan Cepat
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Reservasi Gedung Online
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCheckStatus}
                  className="hover:text-amber-400 transition-colors"
                >
                  • Cek Status Booking & Kwitansi
                </button>
              </li>
              <li>
                {isAdminLoggedIn ? (
                  <button
                    onClick={onOpenAdminDashboard}
                    className="hover:text-amber-400 text-amber-300 transition-colors flex items-center gap-1 font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Panel Kontrol Admin
                  </button>
                ) : (
                  <button
                    onClick={onOpenAdminLogin}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Login Admin Pengelola
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Gedung Tammuan Mali' Makale. Hak Cipta Dilindungi.</p>
          <p>Sistem Informasi & Reservasi Kalender Pemkab Tana Toraja</p>
        </div>
      </div>
    </footer>
  );
};
