// src/components/admin/ConfirmDialog.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Loader2, X } from 'lucide-react';
/**
 * Reusable confirmation modal.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null);
 *   ...
 *   setConfirm({
 *     title: 'Delete application?',
 *     message: 'This cannot be undone.',
 *     confirmLabel: 'Delete',
 *     variant: 'danger',
 *     onConfirm: async () => { ... },
 *   });
 *   ...
 *   <ConfirmDialog state={confirm} onClose={() => setConfirm(null)} />
 */
const ConfirmDialog = ({ state, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!state?.onConfirm) return;
    try {
      setLoading(true);
      await state.onConfirm();
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const variantStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'bg-red-50 text-red-600',
    },
    default: {
      button: 'bg-black hover:bg-gray-800 text-white',
      icon: 'bg-gray-100 text-gray-700',
    },
  };

  const variant = variantStyles[state?.variant || 'default'];

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => !loading && onClose()}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-xl"
          >
            {/* Close */}
            <div className="flex justify-end p-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 -mt-2">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${variant.icon}`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-gray-900">
                {state.title || 'Are you sure?'}
              </h3>
              {state.message && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {state.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
              >
                {state.cancelLabel || 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2 disabled:opacity-60 ${variant.button}`}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {state.confirmLabel || 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;