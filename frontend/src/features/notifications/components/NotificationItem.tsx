import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';
import type { Notification } from '../services/notificationService';


interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const navigate = useNavigate();

  const handleNotificationClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (onClose) onClose();

    // Navigation logic
    if (notification.type === 'PROJECT_ASSIGNED') {
      navigate(`/projects/${notification.relatedId}`);
    } else {
      navigate('/tasks');
    }
  };

  const initials = notification.senderDetails?.name
    ? notification.senderDetails.name.charAt(0).toUpperCase()
    : '?';

  return (
    <div
      onClick={handleNotificationClick}
      className={`flex items-start gap-4 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        notification.isRead
          ? 'bg-white border-transparent hover:bg-slate-50'
          : 'bg-indigo-50/30 border-indigo-500 hover:bg-indigo-50/50'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {notification.senderDetails?.avatar ? (
          <img
            src={notification.senderDetails.avatar}
            alt={notification.senderDetails.name}
            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
            {initials}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow space-y-1">
        <p className="text-sm font-medium text-slate-900 leading-tight">
          <span className="font-bold">{notification.senderDetails?.name || 'System'}</span>
          <span className="text-slate-600 font-normal"> · {notification.message}</span>
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      {/* Unread Indicator */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shadow-sm shadow-indigo-200" />
      )}
    </div>
  );
};
