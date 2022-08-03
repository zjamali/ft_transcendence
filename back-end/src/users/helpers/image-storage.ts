import { diskStorage } from 'multer';

// import * as fs from 'fs';
import * as path from 'path';
import { uuid } from 'uuidv4';
// import * as FileType from 'file-type';
import RequestWithUser from '../requestWithUser.interface';
// import { from, Observable, of, switchMap } from 'rxjs';

// type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

// const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req: RequestWithUser, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuid() + fileExtension;

      console.log('from filename function');
      console.log(file);
      cb(null, fileName);
    },
  }),
  // fileFilter: (_req, file, cb) => {
  //   console.log('from fileFilter function');
  //   console.log(file);
  //   // console.log(FileType.fileTypeFromFile(file));
  //   const allowedMimeTypes: validMimeType[] = validMimeTypes;
  //   allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  // },
};

// export const isFileExtensionSafe = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   return from(FileType.fromFile(fullFilePath)).pipe(
//     switchMap(
//       (_fileExtensionAndMimeType: {
//         ext: validFileExtension;
//         mime: validMimeType;
//       }) => {
//         if (!_fileExtensionAndMimeType) return of(false);
//       },
//     ),
//   );
// };
