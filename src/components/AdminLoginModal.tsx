import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  AlertCircle, 
  KeyRound, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Default admin credentials
    if (username.trim() === 'admin' && password === 'tammuanmali2026') {
      onLoginSuccess();
      onClose();
    } else {
      setError('Username atau Password pengelola salah. Gunakan username: admin dan password: tammuanmali2026');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('tammuanmali2026');
    setError(null);
    setTimeout(() => {
      onLoginSuccess();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 pb-5 text-center relative border-b border-amber-900/40">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>

          <h2 className="text-xl font-bold text-stone-100">
            Login Admin Pengelola
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Panel Kontrol Reservasi Gedung Tammuan Mali' Makale
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Demo Credentials Helper Pill */}
          <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 text-xs text-stone-700">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                Kredensial Akses Pengelola:
              </span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-semibold px-2 py-0.5 rounded">
                Demo
              </span>
            </div>
            <p className="text-[11px] text-stone-600">
              Username: <code className="font-bold text-stone-900 bg-white px-1.5 py-0.5 rounded border border-amber-200">admin</code>
            </p>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Password: <code className="font-bold text-stone-900 bg-white px-1.5 py-0.5 rounded border border-amber-200">tammuanmali2026</code>
            </p>

          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Username Pengelola
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-stone-900"
                  required
                />
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm font-medium text-stone-900"
                  required
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>Masuk ke Panel Kontrol</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
