import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const result = await cloudinary.search
      .expression("folder:Nigcomsat_Accelerator")
      .sort_by("created_at", "desc")
      .max_results(100)
      .execute();

    return res.status(200).json({
      resources: result.resources,
    });
  } catch (error) {
  console.error("Cloudinary Error:", error);

  return res.status(500).json({
    message: error.message,
    error,
  });
}
   
}