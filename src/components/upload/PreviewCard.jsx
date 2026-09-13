// src/components/upload/PreviewCard.jsx
import { Trash2, Video } from 'lucide-react';
import formatBytes from '../../utils/formatBytes';

const PreviewCard = ({ image, remove }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
      <div className="relative h-48 w-full bg-black">
        {image.isVideo ? (
          <video
            src={image.preview}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={image.preview}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
        {image.isVideo && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 text-white text-xs">
            <Video size={12} /> Video
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm truncate" title={image.file.name}>
          {image.file.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatBytes(image.file.size)}
        </p>

        <div className="mt-3 flex justify-end">
          <button
            onClick={() => remove(image.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewCard;