import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HallOverview } from './components/HallOverview';
import { BookingCalendar } from './components/BookingCalendar';
import { BookingFormModal } from './components/BookingFormModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { CheckBookingStatus } from './components/CheckBookingStatus';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Booking, BlockedDate, BookingStatus, PaymentStatus } from './types';
import { INITIAL_BOOKINGS, INITIAL_BLOCKED_DATES } from './data/constants';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEYS = {
  BOOKINGS: 'tammuan_mali_bookings_v2',
  BLOCKED_DATES: 'tammuan_mali_blocked_dates_v2',
  ADMIN_AUTH: 'tammuan_mali_admin_logged_in_v2',
};

export default function App() {
  // Load bookings from localStorage or fallback to realistic initial data
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading bookings from localStorage', err);
    }
    return INITIAL_BOOKINGS;
  });

  // Load blocked maintenance dates
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading blocked dates from localStorage', err);
    }
    return INITIAL_BLOCKED_DATES;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // View state: 'public' or 'admin'
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedDate, setPreselectedDate] = useState<string | undefined>();

  const [activeReceiptBooking, setActiveReceiptBooking] = useState<Booking | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Sync bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to save bookings to localStorage', e);
    }
  }, [bookings]);

  // Sync blocked dates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(blockedDates));
    } catch (e) {
      console.error('Failed to save blocked dates to localStorage', e);
    }
  }, [blockedDates]);

  // Sync admin auth to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminLoggedIn));
    } catch (e) {
      console.error('Failed to save auth state to localStorage', e);
    }
  }, [isAdminLoggedIn]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers for Public Booking
  const handleOpenBooking = (dateStr?: string) => {
    setPreselectedDate(dateStr);
    setIsBookingModalOpen(true);
  };

  const handleCreateBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setIsBookingModalOpen(false);
    setActiveReceiptBooking(newBooking);
    setIsReceiptModalOpen(true);
    showToast(`Permohonan booking #${newBooking.id} berhasil diajukan! Tanggal acara ${newBooking.date} tercatat.`);
  };

  // Handlers for Admin
  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin');
    showToast('Berhasil masuk sebagai Admin Pengelola Gedung Tammuan Mali\'.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('public');
    showToast('Admin berhasil keluar.', 'info');
  };

  const handleUpdateBookingStatus = (
    id: string,
    status: BookingStatus,
    notes?: string,
    rejectionReason?: string
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            adminNotes: notes !== undefined ? notes : b.adminNotes,
            rejectionReason: rejectionReason !== undefined ? rejectionReason : b.rejectionReason,
          };
        }
        return b;
      })
    );
    showToast(
      status === 'confirmed'
        ? `Reservasi #${id} telah disetujui & tanggal resmi dikunci!`
        : status === 'rejected'
        ? `Reservasi #${id} telah ditolak.`
        : `Status reservasi #${id} diperbarui.`
    );
  };

  const handleUpdatePaymentStatus = (id: string, paymentStatus: PaymentStatus, dpAmount?: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            paymentStatus,
            dpAmount: dpAmount !== undefined ? dpAmount : b.dpAmount,
          };
        }
        return b;
      })
    );
    showToast(`Status pembayaran #${id} diperbarui menjadi ${paymentStatus}.`);
  };

  const handleRescheduleBooking = (id: string, newDate: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            date: newDate,
            adminNotes: `Jadwal dipindahkan ke tanggal ${newDate} oleh Admin.`,
          };
        }
        return b;
      })
    );
    showToast(`Tanggal #${id} berhasil di-reschedule ke ${newDate}.`);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    showToast(`Data reservasi #${id} telah dihapus.`);
  };

  const handleAddBlockedDate = (newBlock: Omit<BlockedDate, 'id' | 'createdAt'>) => {
    const blockedItem: BlockedDate = {
      ...newBlock,
      id: `block-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setBlockedDates((prev) => [blockedItem, ...prev]);
    showToast(`Tanggal ${newBlock.date} berhasil dikunci.`);
  };

  const handleRemoveBlockedDate = (id: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.id !== id));
    showToast('Kunci tanggal / maintenance telah dibuka.');
  };

  const handleOpenReceipt = (booking: Booking) => {
    setActiveReceiptBooking(booking);
    setIsReceiptModalOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'public') {
      setCurrentView('public');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-600/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium leading-snug">{toastMessage.text}</p>
        </div>
      )}

      {/* Conditional View: Admin Dashboard OR Public Portal */}
      {currentView === 'admin' && isAdminLoggedIn ? (
        <AdminDashboard
          bookings={bookings}
          blockedDates={blockedDates}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onUpdatePaymentStatus={handleUpdatePaymentStatus}
          onRescheduleBooking={handleRescheduleBooking}
          onDeleteBooking={handleDeleteBooking}
          onAddBlockedDate={handleAddBlockedDate}
          onRemoveBlockedDate={handleRemoveBlockedDate}
          onOpenReceipt={handleOpenReceipt}
          onLogout={handleAdminLogout}
          onViewPublicSite={() => setCurrentView('public')}
        />
      ) : (
        <>
          <Header
            onOpenBooking={() => handleOpenBooking()}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
            onNavigateTo={scrollToSection}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminDashboard={() => setCurrentView('admin')}
            bookings={bookings}
          />

          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
            <HallOverview
              onOpenBooking={() => handleOpenBooking()}
              onNavigateToCalendar={() => scrollToSection('kalender')}
            />

            <BookingCalendar
              bookings={bookings}
              blockedDates={blockedDates}
              onSelectDate={(dateStr) => handleOpenBooking(dateStr)}
            />
          </main>

          <Footer
            onOpenBooking={() => handleOpenBooking()}
            onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminDashboard={() => setCurrentView('admin')}
          />
        </>
      )}

      {/* MODAL 1: Booking Form Modal */}
      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialDate={preselectedDate}
        bookings={bookings}
        blockedDates={blockedDates}
        onSubmitBooking={handleCreateBooking}
      />

      {/* MODAL 2: Receipt / Invoice Modal */}
      <BookingSuccessModal
        booking={activeReceiptBooking}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />

      {/* MODAL 3: Check Booking Status Tracker */}
      <CheckBookingStatus
        isOpen={isCheckStatusOpen}
        onClose={() => setIsCheckStatusOpen(false)}
        bookings={bookings}
        onOpenReceipt={handleOpenReceipt}
      />

      {/* MODAL 4: Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
