import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';

interface RedoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  isSubmitting?: boolean;
}

export const RedoFeedbackModal: React.FC<RedoFeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  isSubmitting 
}) => {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onConfirm(note);
      setNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-50 rounded-xl">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Request Changes</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                Feedback for the team
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                autoFocus
                placeholder="Explain what needs to be fixed or improved..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 transition-all resize-none"
              />
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !note.trim()}
                className="flex-[2] flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-2xl text-sm font-bold hover:bg-rose-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 shadow-lg shadow-rose-200"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Confirm Redo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
