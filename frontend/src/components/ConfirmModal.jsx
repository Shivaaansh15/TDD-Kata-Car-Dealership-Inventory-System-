import React from 'react';
import { AlertTriangle, ShoppingBag, PlusCircle, Trash2, X, Loader2 } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'delete', // 'delete' | 'purchase' | 'restock'
  loading = false,
}) => {
  if (!isOpen) return null;

  let icon = <AlertTriangle className="w-6 h-6 text-amber-400" />;
  let buttonBg = 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20';
  let badgeBorder = 'border-rose-500/30 bg-rose-500/10';

  if (type === 'purchase') {
    icon = <ShoppingBag className="w-6 h-6 text-emerald-400" />;
    buttonBg = 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20';
    badgeBorder = 'border-emerald-500/30 bg-emerald-500/10';
  } else if (type === 'restock') {
    icon = <PlusCircle className="w-6 h-6 text-indigo-400" />;
    buttonBg = 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20';
    badgeBorder = 'border-indigo-500/30 bg-indigo-500/10';
  } else if (type === 'delete') {
    icon = <Trash2 className="w-6 h-6 text-rose-400" />;
    buttonBg = 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20';
    badgeBorder = 'border-rose-500/30 bg-rose-500/10';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden text-center">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-14 h-14 rounded-2xl ${badgeBorder} border flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>

        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 text-xs leading-relaxed mb-6">{message}</p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 font-medium text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-xs shadow-lg transition-all duration-200 active:scale-95 cursor-pointer ${buttonBg}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Confirm Action</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
