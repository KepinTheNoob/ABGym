import { Loader2, Trash2 } from "lucide-react";

type ClearTableModalProps = {
  open: boolean;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ClearTableModal({
  open,
  isVisible,
  onClose,
  onConfirm,
  isLoading = false,
}: ClearTableModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl bg-[#1A1A1A] border border-gray-800 p-6 shadow-2xl transform transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Icon Circle */}
        <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>

        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Clear All Transactions?
          </h3>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            This will permanently delete <b>all data</b> from the table. 
            <br />
            This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-700 text-gray-300 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Clearing...</span>
              </div>
            ) : (
              "Yes, Clear All"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}