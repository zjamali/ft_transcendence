import * as fs from 'fs';
import * as path from 'path';
import { uuid } from 'uuidv4';
import { diskStorage } from 'multer';
import RequestWithUser from '../interfaces/requestWithUser.interface';

type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: RequestWithUser, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuid() + fileExtension;

      const pathIndex = req.user.image.indexOf('uploads');
      const oldImgPath = './' + req.user.image.slice(pathIndex);
      if (fs.existsSync(oldImgPath)) {
        fs.unlinkSync(oldImgPath);
      }

      cb(null, fileName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};
