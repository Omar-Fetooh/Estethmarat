import { v2 as cloudinary } from 'cloudinary';

export const cloundinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_APISECRET,
  });
  return cloudinary;
};
