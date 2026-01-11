import React from 'react';
import { useStore } from '../../store/StoreContext';
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiX } from 'react-icons/hi';

const NotificationManager: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-6 left-6 z-[999] flex flex-col gap-3 min-w-[320px] max-w-md pointer-events-none">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
            pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-left-4 duration-300
            ${n.type === 'success' ? 'bg-green-600 border-green-500 text-white' : ''}
            ${n.type === 'error' ? 'bg-red-600 border-red-500 text-white' : ''}
            ${n.type === 'info' ? 'bg-blue-600 border-blue-500 text-white' : ''}
          `}
        >
          <span className="text-xl">
            {n.type === 'success' && <HiCheckCircle />}
            {n.type === 'error' && <HiExclamationCircle />}
            {n.type === 'info' && <HiInformationCircle />}
          </span>
          <p className="font-bold flex-1">{n.message}</p>
          <button
            onClick={() => removeNotification(n.id)}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <span className="text-xl"><HiX /></span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;
