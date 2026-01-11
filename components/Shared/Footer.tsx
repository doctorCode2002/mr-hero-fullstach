import React from 'react';
import { HiMail, HiPhone, HiAtSymbol } from 'react-icons/hi';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Mr Hero Logo" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-bold text-white">مستر هيرو</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              منصة الجملة الأولى للملابس، نسهل عليك بدء تجارتك بأقل المخاطر وأعلى الأرباح.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  الرئيسية
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  عروض الباليتات
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  قصص النجاح
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  حاسبة الأرباح
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">الأصناف</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  ملابس رجالية
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  ملابس نسائية
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  ملابس أطفال
                </a>
              </li>
              <li>
                <a className="hover:text-orange-500 transition-colors" href="#">
                  أحذية واكسسوارات
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-xl"><HiMail /></span>
                <span>info@mrhero.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xl"><HiPhone /></span>
                <span>+966 50 123 4567</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2023 مستر هيرو. جميع الحقوق محفوظة.</p>
          <div className="flex space-x-4 space-x-reverse mt-4 md:mt-0">
            <a className="hover:text-white" href="#">
              <span className="text-lg"><FaFacebook /></span>
            </a>
            <a className="hover:text-white" href="#">
              <span className="text-lg"><FaInstagram /></span>
            </a>
            <a className="hover:text-white" href="#">
              <span className="text-lg"><HiAtSymbol /></span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
