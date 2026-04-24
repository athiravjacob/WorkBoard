import React, { useState } from 'react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useAddTaskNote } from '../hooks/useAddTaskNote';
import { Send, Loader2 } from 'lucide-react';

interface AddProgressNoteProps {
  taskId: string;
  projectId?: string;
  assignedTo?: string;
}

export const AddProgressNote: React.FC<AddProgressNoteProps> = ({ taskId, projectId, assignedTo }) => {
  const [note, setNote] = useState('');
  const { user } = useAuthStore();
  const { mutate: addNote, isPending } = useAddTaskNote(projectId);

  // Permissions: Only PM or Assigned User can add notes
  const canAddNote = user?.role === 'PM' || user?.role === 'ADMIN' || user?.id === assignedTo;

  if (!canAddNote) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || isPending) return;

    addNote({ taskId, note }, {
      onSuccess: () => setNote('')
    });
  };

  const getInitial = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div className="flex items-start space-x-4 pt-4 border-t border-slate-100">
      {/* User Avatar */}
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
        {getInitial(user?.name || '')}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex-1 relative">
        <textarea
          rows={1}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a progress update..."
          disabled={isPending}
          className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 pr-12 text-sm text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none min-h-[44px]"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="submit"
          disabled={!note.trim() || isPending}
          className={`absolute right-2 top-1.5 p-2 rounded-xl transition-all ${
            !note.trim() || isPending 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-indigo-600 hover:bg-indigo-50 hover:scale-110 active:scale-95'
          }`}
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};
