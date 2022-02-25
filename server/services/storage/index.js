import multer from 'multer';

import { TEMP_DIRECTORY } from '../../constants';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, TEMP_DIRECTORY)
  },
  filename: (req, file, callback) => {
    callback(null, 'upload');
  }
});

export const fileUploadMiddleware = multer({ storage: storage });
