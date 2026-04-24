import React from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';

interface ProgressNote {
  userId: any;
  userName?: string;
  note: string;
  createdAt: string;
}

interface TaskActivityTimelineProps {
  notes: ProgressNote[] | undefined;
}

export const TaskActivityTimeline: React.FC<TaskActivityTimelineProps> = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="py-8 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-400 italic">No progress updates yet</p>
      </div>
    );
  }

  // Sort notes: most recent at the top
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getInitial = (name?: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getUserName = (note: ProgressNote) => {
    if (typeof note.userId === 'object' && note.userId?.name) {
      return note.userId.name;
    }
    return note.userName || 'Team Member';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays < 7) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    return format(date, 'MMM d, h:mm a');
  };

  return (
    <div className="space-y-1 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
      {sortedNotes.map((note, idx) => {
        const name = getUserName(note);
        const initial = getInitial(name);

        return (
          <div 
            key={idx} 
            className="group relative flex items-start space-x-4 pl-0 py-4 animate-in fade-in slide-in-from-left-4" 
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Avatar / Circle */}
            <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:border-indigo-100 transition-colors">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 w-7 h-7 rounded-full flex items-center justify-center">
                {initial}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 flex items-center bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100/50">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md group-hover:border-slate-200 transition-all">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">
                  {note.note}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
