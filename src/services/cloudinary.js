// src/services/cloudinary.js
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Detect the Cloudinary resource type from the file.
 * Videos MUST go to /video/upload/ or they'll be stored as images and won't play.
 */
const detectResourceType = (file, override) => {
  if (override === 'video' || override === 'image' || override === 'raw') {
    return override;
  }
  if (file?.type?.startsWith('video/')) return 'video';
  if (file?.type?.startsWith('image/')) return 'image';
  return 'auto';
};

/**
 * Upload a file to Cloudinary.
 * @param {File} file
 * @param {'image'|'video'|'raw'} [resourceType] - optional override
 */
export const uploadImage = async (file, resourceType) => {
  if (!file) throw new Error('No file provided');
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Missing Cloudinary env vars. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const type = detectResourceType(file, resourceType);

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);
  data.append('folder', 'Nigcomsat_Accelerator');
  // ⚠️ No `eager` or `eager_async` — Cloudinary blocks these on unsigned uploads.

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
    { method: 'POST', body: data }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || 'Cloudinary upload failed');
  }

  if (type === 'video' && json.resource_type !== 'video') {
    throw new Error(
      `Cloudinary stored the video as "${json.resource_type}" instead of "video". ` +
        `Fix your upload preset: Settings → Upload → your preset → set Resource type to "Auto".`
    );
  }

  return json;
};