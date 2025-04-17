import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import { AppError } from '../Utils/AppError.js';
import { cloundinaryConfig } from '../Utils/cloudinary.js';
import streamifier from 'streamifier';

const uploadImageToCloudinary = async (buffer, filename) => {
  const stream = await cloundinaryConfig().uploader.upload_stream({
    folder: 'Users',
    public_id: filename,
    resource_type: 'image',
  });
  streamifier.createReadStream(buffer).pipe(stream);
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('please upload image only', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadPhoto = upload.single('profilePhoto');

export const resizePhoto = async (req, res, next) => {
  try {
    const random = crypto.randomBytes(32).toString('hex');
    req.body.profilePhoto = `investor-${random}.jpeg`;
    const image = await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();
    await uploadImageToCloudinary(image, req.body.profilePhoto);
    next();
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
