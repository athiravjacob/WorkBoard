import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Bell } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { NotificationList } from './NotificationList';

export const NotificationBell: React.FC = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button 
            className={`relative p-2.5 rounded-2xl transition-all duration-300 outline-none ${
              open ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600 border border-slate-100'
            }`}
          >
            <Bell className={`w-5 h-5 ${open ? 'animate-none' : 'hover:rotate-12 transition-transform'}`} />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white shadow-sm ring-1 ring-rose-200">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Popover.Button>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <Popover.Panel className="absolute right-0 z-50 mt-4 w-screen max-w-sm transform px-4 sm:px-0">
              <NotificationList />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
