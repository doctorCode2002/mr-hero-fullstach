
import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';

const AdminLogin: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(password);
    if (success) {
      onLogin?.();
      return;
    }
    setError(true);
    setTimeout(() => setError(false), 3000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-2xl border border-gray-100 dark:border-gray-800 transition-colors">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gray-900 dark:bg-emerald-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-black text-3xl">H</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">دخول المسؤول</h2>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">يرجى إدخال كلمة المرور للمتابعة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-gray-800 border-2 ${error ? 'border-red-500' : 'border-transparent'} focus:border-emerald-500 dark:focus:border-emerald-500 rounded-2xl py-5 px-6 outline-none text-gray-900 dark:text-white font-black transition-all shadow-inner text-right`}
                placeholder="••••••••"
                dir="rtl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-[10px] font-black mt-2 text-right">كلمة المرور غير صحيحة، حاول مجدداً.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 dark:bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-gray-200 dark:shadow-none mt-4"
          >
            تسجيل الدخول
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 dark:border-gray-800 text-center">
          <p className="text-gray-400 text-[11px] font-bold">
            هذه المنطقة مخصصة لمسؤولي مستر هيرو فقط.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
