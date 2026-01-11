import React from 'react';
import { HiBadgeCheck, HiTruck, HiChatAlt2 } from 'react-icons/hi';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-tajawal animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative py-20 bg-orange-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold mb-4">
            قصتنا
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            مستر <span className="text-orange-500">هيرو</span>
          </h1>
          <p className="tex-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            شريكك الموثوق في تجارة الباليتات بالجملة. نحن نربط التجار بأفضل الفرص الاستثمارية من جميع أنحاء العالم.
          </p>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">لماذا نحن؟</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-orange-500 text-2xl"><HiBadgeCheck /></span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">جودة مضمونة</h3>
                  <p className="text-gray-600">نضمن لك أفضل البضائع المفروزة بعناية وعالية الجودة.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-orange-500 text-2xl"><HiTruck /></span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">شحن سريع</h3>
                  <p className="text-gray-600">خدمات شحن موثوقة وسريعة لجميع أنحاء المملكة.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-orange-500 text-2xl"><HiChatAlt2 /></span>
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">دعم متواصل</h3>
                  <p className="text-gray-600">فريقنا متاح دائماً للإجابة على استفساراتكم ومساعدتكم.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
            <div className="relative bg-white border border-gray-100 rounded-3xl p-8 shadow-xl">
               <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
               <p className="text-gray-600 leading-relaxed">
                 نسعى لأن نكون المنصة الرائدة عربياً في مجال تجارة الجملة والستوكات، مقدمين حلولاً ذكية ومبتكرة تمكن التجار من تنمية أعمالهم وتحقيق أقصى قدر من الأرباح بكل سهولة وموثوقية.
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
