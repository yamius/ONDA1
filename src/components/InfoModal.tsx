import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export function InfoModal({ isOpen, onClose, message }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 border border-purple-500/40 rounded-2xl max-w-md w-full shadow-2xl shadow-purple-900/50 max-h-[80vh] flex flex-col">
        <div className="flex justify-end items-start p-4 pb-0">
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors bg-white/10 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="text-center py-2">
            <p className="text-white/95 text-base leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
        </div>

        <div className="p-4 pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="px-12 bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/30"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
