import React, { useState } from 'react';
import { useStore } from '../../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff, HiExclamationCircle } from 'react-icons/hi';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { loginAdmin, isAdminAuthenticated } = useStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginAdmin(username, password);
    if (success) {
      // loginAdmin handles state update, useEffect handles redirect
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };


  return (
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 via-white to-orange-100 animate-in fade-in zoom-in-95 duration-500 font-tajawal">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-orange-100 transition-colors">
        <div className="text-center mb-10 group">
          <div className="w-20 h-20 mx-auto mb-6 transition-transform duration-500 group-hover:rotate-[360deg]">
            <img src="/logo.png" alt="Mr Hero Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">لوحة الإدارة</h1>
          <p className="text-gray-500 font-medium">سجل دخولك للتحكم في المتجر</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">اسم المستخدم</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full bg-gray-50 border-2 border-gray-100 focus:border-orange-500 rounded-2xl px-5 py-4 outline-none transition-all font-bold text-gray-900 placeholder-gray-400 text-lg`}
                placeholder="أدخل اسم المستخدم"
                dir="rtl"
              />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 mr-1">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 border-2 ${error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-orange-500'} rounded-2xl px-5 py-4 outline-none transition-all font-bold text-gray-900 placeholder-gray-400 text-lg`}
                placeholder="أدخل كلمة مرور المسؤول"
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className=" absolute left-4 top-1/2 -translate-y-[calc(50%-6px)] text-gray-400 hover:text-orange-600 transition-colors flex items-center justify-center"
                tabIndex={-1}
              >
                  <span className="text-xl">{showPassword ? <HiEyeOff /> : <HiEye />}</span>
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm font-bold flex items-center gap-1 animate-in slide-in-from-top-1">
                <span className="text-base"><HiExclamationCircle /></span>
                كلمة المرور غير صحيحة
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            تسجيل الدخول
          </button>
        </form>
        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-sm text-gray-400 font-bold hover:text-orange-600 transition-colors"
            >
                العودة للمتجر الرئيسي
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
