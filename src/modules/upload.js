import { AppError } from '../Utils/AppError.js';
import multer from 'multer';
import crypto from 'crypto';
import sharp from 'sharp';
import { cloudinaryConfig } from '../Utils/cloudinary.js';
import streamifier from 'streamifier';
import { type } from 'os';
// 1) upload photo
const multerStortage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   // 1) check if the uploaded file is image or not
//   if (file.mimetype.startsWith('image')) cb(null, true);
//   else {
//     cb(new AppError("can't upload this file, please upload image", 400), false);
//   }
// };
const upload = multer({
  storage: multerStortage,
  // fileFilter: multerFilter,
});

export const uploadCompanyPhoto = upload.fields([
  { name: 'companyPhoto', maxCount: 1 },
  {
    name: 'financialReportPDF',
    maxCount: 1,
  },
  { name: 'bmc', maxCount: 1 },
]);

export const uploadInvestorPhoto = upload.single('profilePhoto');
// image processing
const uploadImageToCloudinary = (buffer, type = 'image', filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryConfig().uploader.upload_stream(
      {
        folder: 'users',
        resource_type: type,
        public_id: type === 'raw' ? `${filename}.pdf` : filename,
      },
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const imageProcessing = async (req, res, next) => {
  try {
    if (req.files && req.files.companyPhoto) {
      const prossedPhoto = await sharp(req.files.companyPhoto[0].buffer)
        .resize(500, 500)
        .toBuffer();
      const photoUrl = await uploadImageToCloudinary(
        prossedPhoto,
        'image',
        req.files.companyPhoto[0].originalName
      );
      req.body.companyPhoto = photoUrl;
    }
    if (req.files && req.files.financialReportPDF) {
      const pdfUrl = await uploadImageToCloudinary(
        req.files.financialReportPDF[0].buffer,
        'raw',
        req.files.financialReportPDF[0].fieldname
      );
      req.body.financialReportPDF = pdfUrl;
    }
    if (req.files && req.files.bmc) {
      const bmcUrl = await uploadImageToCloudinary(
        req.files.bmc[0].buffer,
        'raw',
        req.files.bmc[0].fieldname
      );
      req.body.bmc = bmcUrl;
    }
    if (req.file) {
      const prossedPhoto = await sharp(req.file.buffer)
        .resize(500, 500)
        .toBuffer();
      const profilePhotoUrl = await uploadImageToCloudinary(prossedPhoto);
      req.body.profilePhoto = profilePhotoUrl;
    }
  } catch (err) {
    console.log(err);
  }
  next();
};
