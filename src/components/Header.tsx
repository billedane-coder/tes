import React from 'react';
import { Calendar, ShieldCheck, Search, PhoneCall, Building2, Menu, X, Landmark } from 'lucide-react';
import { Booking } from '../types';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenAdminLogin: () => void;
  onOpenCheckStatus: () => void;
  onNavigateTo: (sectionId: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminDashboard: () => void;
  bookings: Booking[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenAdminLogin,
  onOpenCheckStatus,
  onNavigateTo,
  isAdminLoggedIn,
  onOpenAdminDashboard,
  bookings,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Count pending bookings for admin badge
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigateTo(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-amber-900/30 text-stone-100 shadow-md">
      {/* Top Bar with location and hotline */}
      <div className="bg-stone-950 text-xs border-b border-stone-800/60 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-stone-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gedung Serbaguna Resmi • Pusat Kota Makale, Tana Toraja</span>
          </div>
          <div className="flex items-center gap-4 text-stone-300">
            <a
              href="https://wa.me/6282190874321?text=Halo%20Pengelola%20Gedung%20Tammuan%20Mali%27%20Makale%2C%20saya%20ingin%20bertanya%20mengenai%20sewa%20gedung."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
              <span>Layanan Reservasi: 0821-9087-4321</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Title */}
          <div
            onClick={() => handleNavClick('beranda')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-amber-900/40 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Landmark className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-amber-100 tracking-wide">
                  TAMMUAN MALI'
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Makale
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                Gedung Pertemuan & Konvensi Tana Toraja
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('beranda')}
              className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/60 rounded-lg transition-colors"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('kalender')}
              className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Kalender Booking</span>
            </button>
            <button
              onClick={() => handleNavClick('fasilitas')}
              className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/60 rounded-lg transition-colors"
            >
              Fasilitas & Tarif
            </button>
            <button
              onClick={onOpenCheckStatus}
              className="px-3 py-2 text-sm font-medium text-stone-300 hover:text-amber-300 hover:bg-stone-800/60 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Cek Status</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAdminLoggedIn ? (
              <button
                id="btn-admin-dashboard"
                onClick={onOpenAdminDashboard}
                className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-950/80 hover:bg-amber-900/90 text-amber-200 border border-amber-600/50 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Panel Kontrol Admin</span>
                {pendingCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold animate-pulse">
                    {pendingCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                id="btn-admin-login"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-stone-100 hover:bg-stone-800/80 rounded-lg border border-stone-700/60 transition-colors"
                title="Login Pengelola Reservasi"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                <span>Login Admin</span>
              </button>
            )}

            <button
              id="btn-header-booking"
              onClick={onOpenBooking}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 shadow-md shadow-amber-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              <span>Booking Sekarang</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
              aria-label="Buka Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('beranda')}
            className="w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('kalender')}
            className="w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            Kalender Booking
          </button>
          <button
            onClick={() => handleNavClick('fasilitas')}
            className="w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium"
          >
            Fasilitas & Tarif Sewa
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenCheckStatus();
            }}
            className="w-full text-left py-2 text-stone-200 hover:text-amber-400 font-medium flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-amber-400" />
            Cek Status Reservasi
          </button>

          <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-stone-950" />
              Booking Gedung Sekarang
            </button>

            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdminDashboard();
                }}
                className="w-full py-2.5 rounded-lg bg-amber-950 text-amber-200 border border-amber-600 font-semibold text-center flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Panel Admin ({pendingCount} pending)
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full py-2 rounded-lg bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-center flex items-center justify-center gap-2 text-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Login Admin Pengelola
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
