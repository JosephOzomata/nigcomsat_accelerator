// src/components/upload/UploadButton.jsx
import { UploadCloud, Loader2 } from 'lucide-react';

const UploadButton = ({ onClick, disabled, loading, count = 0 }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-medium transition hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <UploadCloud size={18} />
          Upload {count > 0 ? `${count} file${count > 1 ? 's' : ''}` : 'files'}
        </>
      )}
    </button>
  );
};

export default UploadButton;