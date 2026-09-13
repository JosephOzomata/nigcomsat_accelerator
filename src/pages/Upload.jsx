import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import UploadArea from "../components/upload/UploadArea";
import PreviewCard from "../components/upload/PreviewCard";
import UploadButton from "../components/upload/UploadButton";
import ProgressBar from "../components/upload/ProgressBar";

import { uploadImage } from "../services/cloudinary";

const Upload = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const removeImage = (id) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);

      if (img) {
        URL.revokeObjectURL(img.preview);
      }

      return prev.filter((i) => i.id !== id);
    });
  };

  const uploadAll = async () => {
    if (!images.length) {
      toast.error("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const uploadedImages = [];

      for (let i = 0; i < images.length; i++) {
        const result = await uploadImage(images[i].file);

        uploadedImages.push(result);

        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      toast.success(`${uploadedImages.length} image(s) uploaded successfully!`);

      images.forEach((img) => URL.revokeObjectURL(img.preview));

      setImages([]);
      setProgress(0);
    } catch (err) {
      console.log(err);

      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-slate-100 pt-30 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-10"
          >

            <div className="mb-12">

              <h1 className="text-5xl font-bold">
                Upload Gallery Images
              </h1>

              

            </div>

            <UploadArea
              images={images}
              setImages={setImages}
            />

            {images.length > 0 && (
              <motion.div
                layout
                className="
                mt-10
                grid
                gap-8
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                "
              >
                {images.map((image) => (
                  <PreviewCard
                    key={image.id}
                    image={image}
                    remove={removeImage}
                  />
                ))}
              </motion.div>
            )}

            {uploading && (
              <div className="mt-12">

                <div className="flex justify-between mb-3">

                  <span className="font-medium">
                    Uploading...
                  </span>

                  <span>
                    {progress}%
                  </span>

                </div>

                <ProgressBar progress={progress} />

              </div>
            )}

            <div className="mt-10">

              <UploadButton
                onClick={uploadAll}
                disabled={uploading || !images.length}
              />

            </div>

          </motion.div>

        </div>

      </div>
    </>
  );
};

export default Upload;