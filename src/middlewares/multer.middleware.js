import multer from 'multer';

import { AppError, extensions } from '../Utils/index.js';

export const multerHost = ({
  allowedExtensions = [...extensions.Images, extensions.Documents],
}) => {
  const storage = multer.diskStorage({});

  // fileFilter
  const fileFilter = (req, file, cb) => {
    console.log('Uploaded file MIME type:', file.mimetype);
    console.log(allowedExtensions);

    if (allowedExtensions.includes(file.mimetype)) {
      console.log('here');

      return cb(null, true);
    }

    cb(
      new AppError(
        `Invalid file type, only  ${allowedExtensions.join(', ')}`,
        400
      ),
      false
    );
  };

  return multer({ fileFilter, storage });
};
