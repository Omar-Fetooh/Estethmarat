import { AppError } from '../Utils/AppError.js';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import { cloudinaryConfig } from '../Utils/cloudinary.js';
import streamifier from 'streamifier';
import { type } from 'os';
// 1) upload photo
const multerStortage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  // 1) check if the uploaded file is image or not
  if (file.mimetype.startsWith('image')) cb(null, true);
  else {
    cb(new AppError("can't upload this file, please upload image", 400), false);
  }
};
const upload = multer({
  storage: multerStortage,
  fileFilter: multerFilter,
});

export const uploadCompanyPhoto = upload.single('companyPhoto');
export const uploadInvestorPhoto = upload.single('profilePhoto');
export const uploadOrganizationPhoto = upload.single('logoImage');
// export const uploadCompanyPhoto = upload.single(companyField);
// image processing
const uploadImageToCloudinary = async (buffer, filename) => {
  const stream = await cloudinaryConfig().uploader.upload_stream({
    folder: 'users',
    public_id: filename,
    resource_type: 'image',
  });
  streamifier.createReadStream(buffer).pipe(stream);
};

export const imageProcessing = async (req, res, next) => {
  try {
    // name of photo -- company-randomString.ext
    const randomString = crypto.randomBytes(32).toString('hex');
    let result =
      req.body.role === 'company'
        ? 'companyPhoto'
        : req.body.role === 'investor'
        ? 'profilePhoto'
        : 'logoImage';

    req.body[result] = `user-${randomString}.jpeg`;
    const prossedPhoto = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();
    await uploadImageToCloudinary(prossedPhoto, req.body[result]);
  } catch (err) {
    console.log(err);
  }
  next();
};
