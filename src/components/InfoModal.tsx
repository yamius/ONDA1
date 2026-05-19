import { X } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function InfoModal({ isOpen, onClose, message }: InfoModalProps) {
  const isLight = useTheme().resolved === 'light';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-2xl max-w-md w-full shadow-2xl max-h-[80vh] flex flex-col border ${
          isLight
            ? 'bg-gradient-to-br from-white via-indigo-50 to-violet-50 border-violet-200 shadow-indigo-200/50'
            : 'bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 border-purple-500/40 shadow-purple-900/50'
        }`}
      >
        <div className="flex justify-end items-start p-4 pb-0">
          <button
            onClick={onClose}
            className={`transition-colors rounded-full p-1 ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 bg-slate-100'
                : 'text-purple-300 hover:text-white bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="text-center py-2">
            <p className={`text-base leading-relaxed whitespace-pre-line ${isLight ? 'text-slate-700' : 'text-white/95'}`}>
              {message}
            </p>
          </div>
        </div>

        <div className="p-4 pt-2 flex justify-center">
          <button
            onClick={onClose}
            className={`px-12 py-2.5 rounded-xl font-semibold transition-all border ${
              isLight
                ? 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-slate-800'
                : 'bg-purple-600 hover:bg-purple-700 border-transparent text-white shadow-lg shadow-purple-500/30'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
