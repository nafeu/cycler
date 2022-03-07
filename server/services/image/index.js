import sharp from 'sharp';
import { MEDIA_DIRECTORY } from '../../constants';
import { promises as fs } from 'fs';

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

export const saveThumbnails = async () => {
  try {
    const youtubeThumbnail = await sharp('tmp/upload')
      .toFormat('jpeg')
      .jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4',
        force: true
      })
      .toBuffer();

    const instagramThumbnail = await sharp('tmp/upload')
      .resize(1080, 608)
      .toFormat('jpeg')
      .jpeg({
        quality: 100,
        chromaSubsampling: '4:4:4',
        force: true
      })
      .toBuffer();

    await fs.writeFile(`${MEDIA_DIRECTORY}/thumbnail-export-youtube.jpg`, youtubeThumbnail);
    await fs.writeFile(`${MEDIA_DIRECTORY}/thumbnail-export-instagram.jpg`, instagramThumbnail);

    return {
      success: true,
      uploads: [
        `${MEDIA_DIRECTORY}/thumbnail-export-youtube.jpg`,
        `${MEDIA_DIRECTORY}/thumbnail-export-instagram.jpg`
      ]
    }
  } catch (error) {
    return {
      error
    }
  }
};
