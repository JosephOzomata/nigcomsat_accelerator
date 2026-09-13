// src/components/upload/UploadArea.jsx
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ImagePlus, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import formatBytes from '../../utils/formatBytes';

const UploadArea = ({ files, setFiles, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const mapped = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        isVideo: file.type.startsWith('video/'),
      }));

      setFiles((prev) => {
        const existing = new Set(prev.map((f) => f.file.name));
        const unique = mapped.filter((f) => !existing.has(f.file.name));
        return [...prev, ...unique];
      });
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled,
    accept: {
      'image/*': [],
      'video/*': [],
    },
  });

  const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);
  const imageCount = files.filter((f) => !f.isVideo).length;
  const videoCount = files.filter((f) => f.isVideo).length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors duration-200 px-6 py-10 text-center ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
            : isDragActive
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />

        <div className="space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gray-100">
              <UploadCloud
                className={`transition-colors ${
                  isDragActive ? 'text-black' : 'text-gray-600'
                }`}
                size={40}
              />
            </div>
          </div>

          <div>
            <p className="text-base font-medium text-gray-800">
              {isDragActive
                ? 'Drop files here'
                : 'Drop images or videos here'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse
            </p>
          </div>

          <p className="text-xs text-gray-400">
            PNG, JPG, GIF, MP4, MOV, WEBM
          </p>
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {imageCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <ImagePlus size={16} className="text-gray-500" />
                    {imageCount} image{imageCount > 1 ? 's' : ''}
                  </span>
                )}
                {videoCount > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Video size={16} className="text-gray-500" />
                    {videoCount} video{videoCount > 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  ({formatBytes(totalSize)})
                </span>
              </div>

              <button
                onClick={() => setFiles([])}
                disabled={disabled}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadArea;