import React, { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { Plus, ChevronLeft, Search, User as UserIcon } from 'lucide-react';
import { userService } from '../../users/services/userService';
import type { User } from '../../../types';

export const ChatSidebar: React.FC = () => {
  const { conversations, activeChatId, setActiveChat, isSelectingUser, setIsSelectingUser, startNewChat } = useChatStore();
  const currentUser = useAuthStore((state) => state.user);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isSelectingUser) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const data = await userService.getAllUsers();
          // Filter out current user
          setUsers(data.filter(u => String(u.id) !== String(currentUser?.id)));
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [isSelectingUser, currentUser?.id]);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 w-80">
      <div className="p-6 border-b border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {isSelectingUser ? 'New Message' : 'Messages'}
          </h2>
          {isSelectingUser ? (
            <button 
              onClick={() => setIsSelectingUser(false)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button 
              onClick={() => setIsSelectingUser(true)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-100 active:scale-95"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {isSelectingUser && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        {isSelectingUser ? (
          loadingUsers ? (
            <div className="p-8 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-medium">Finding teammates...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => startNewChat(user.id)}
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-all border-l-4 border-transparent"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{user.name}</h3>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
               <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <UserIcon className="text-slate-300" size={24} />
               </div>
               <p className="text-sm text-slate-400">No users found</p>
            </div>
          )
        ) : (
          conversations.length > 0 ? (
            conversations.map((conv) => {
              // Find the other participant (assuming 1-on-1 for this version)
              const otherParticipant = conv.participants.find(p => String(p.id) !== String(currentUser?.id)) || conv.participants[0];
              const isActive = activeChatId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                    isActive 
                      ? 'bg-indigo-50/50 border-indigo-600' 
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {otherParticipant.avatar ? (
                      <img 
                        src={otherParticipant.avatar} 
                        alt={otherParticipant.name} 
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                        {otherParticipant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {otherParticipant.name}
                      </h3>
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                        {conv.lastMessage ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false }) : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs truncate ${conv.unreadCount && conv.unreadCount > 0 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {conv.lastMessage?.text || 'No messages yet'}
                      </p>
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 shadow-sm shadow-indigo-200" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={24} />
              </div>
              <p className="text-sm text-slate-400">No conversations yet</p>
              <button 
                onClick={() => setIsSelectingUser(true)}
                className="mt-4 px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Start a conversation
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
