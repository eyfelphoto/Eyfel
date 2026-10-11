import React, { useState } from 'react';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, KeyRound, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // 1. If Supabase is configured, use Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          throw new Error(error.message);
        }

        onLoginSuccess();
        return;
      }

      // 2. Fallback local admin check if Supabase Auth is not yet configured in local environment
      if (email.trim() === 'admin@eyfeltasarim.com' && password === 'eyfel2026') {
        onLoginSuccess();
        return;
      }

      // Allow simple master login during initial setup with clear message
      if (password === 'eyfel2026' || password === 'admin123') {
        onLoginSuccess();
        return;
      }

      throw new Error('Geçersiz yönetici e-posta adresi veya şifre.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Giriş yapılamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Back Button */}
        <div>
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mağazaya Geri Dön</span>
          </button>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-600/30">
            E
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white">Yönetici Girişi</h2>
          <p className="text-xs text-stone-400">
            Ebedi Hatıra Mezar Plakaları Sipariş & Mağaza Yönetim Paneli
          </p>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Yönetici E-Posta:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@eyfeltasarim.com"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              Yönetici Şifresi:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isLoading ? 'Giriş Yapılıyor...' : 'Yönetici Paneline Giriş Yap'}</span>
          </button>
        </form>

        {/* Quick Help for First Setup */}
        <div className="p-3 bg-stone-950/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 space-y-1">
          <div className="flex items-center gap-1 font-semibold text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Güvenli Oturum Bilgisi:</span>
          </div>
          <p>
            Supabase Auth kurulumu tamamlanana kadar ön tanımlı şifre: <code>eyfel2026</code> ile doğrudan giriş yapabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};
