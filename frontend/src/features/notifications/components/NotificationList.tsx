import React from 'react';
import { BellOff, CheckCheck } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationItem } from './NotificationItem';
import { Link } from 'react-router-dom';

interface NotificationListProps {
  onClose?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const notifications = useNotificationStore((state) => state.notifications);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Notifications</h3>
          <p className="text-xs font-medium text-slate-400">You have {unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all active:scale-95 border border-indigo-100"
          >
            <CheckCheck className="w-3 h-3" />
            Mark all read
          </button>
        )}
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto max-h-96 divide-y divide-slate-50 custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onClose={onClose}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <BellOff className="w-8 h-8 text-slate-200" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-900 font-bold">All caught up!</p>
              <p className="text-slate-400 text-xs font-medium max-w-[200px]">
                No new notifications for now. Check back later!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="inline-block text-xs font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest"
        >
          View all history
        </Link>
      </div>
    </div>
  );
};
