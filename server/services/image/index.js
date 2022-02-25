import sharp from 'sharp';
import { MEDIA_DIRECTORY } from '../../constants';

export const saveImageAsJpgAsync = path => new Promise((resolve, reject) => {
  const outputFilename = `${path.split('.')[0]}_${Date.now()}.jpg`;

  sharp('tmp/upload')
    // .resize(width, height)
    .toFormat('jpeg')
    .jpeg({
      quality: 100,
      chromaSubsampling: '4:4:4',
      force: true
    })
    .toFile(`${MEDIA_DIRECTORY}/${outputFilename}`, (error, info) => {
      if (error) {
        reject(error);
      }

      resolve(info);
    });
});
