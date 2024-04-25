const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  const result = await cloudinary.uploader.upload(fileToUploads);
  return { url: result.secure_url,asset_id:result.asset_id,public_id:result.public_id};
};


const cloudinaryDeleteImg = async (fileToDelete) => {
  const result = await cloudinary.uploader.destroy(fileToDelete);
  return { url: result.secure_url,asset_id:result.asset_id,public_id:result.public_id};
};
module.exports = {cloudinaryUploadImg,cloudinaryDeleteImg};
