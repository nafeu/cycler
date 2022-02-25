import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";
import fs from 'fs';
import { filter, map, includes } from 'lodash';
import getVideoDimensions from 'get-video-dimensions';

import { executeShellCommandAsync, getFileInfoFromFolder } from '../../../services/shell';

import { MEDIA_DIRECTORY, INVALID_EXTENSIONS } from '../../../constants';

const getVideoDimensionsAsync = path => new Promise((resolve, reject) => {
  getVideoDimensions(path).then(dimensions => {
    resolve(dimensions);
  }, error => {
    reject(error);
  });
});

export const getMedia = async (req, res, next) => {
  try {
    let files = getFileInfoFromFolder(MEDIA_DIRECTORY);

    files = filter(files, ({ extension }) => !includes(INVALID_EXTENSIONS, extension))

    if (req.query.allow) {
      const extensions = req.query.allow.split(',');

      files = filter(files, ({ extension }) => {
        return includes(extensions, extension);
      });
    }

    if (req.query.omit) {
      const extensions = req.query.omit.split(',');

      files = filter(files, ({ extension }) => {
        return !includes(extensions, extension);
      });
    }

    let allMedia = [];
    for (const media of files) {
      const dimensions = await getVideoDimensionsAsync(`media/${media.name}`);

      allMedia.push({
        path: media.name,
        name: media.name,
        size: media.size,
        dimensions
      })
    }

    res.json({ allMedia });
  } catch (error) {
    next(error);
  }
};

export const getMediaPreview = async (req, res, next) => {
  const { path } = req.query;

  try {
    const file = `${MEDIA_DIRECTORY}/${path}`;

    res.download(file);
  } catch (error) {
    next(error);
  }
}

export const postMediaConvert = async (req, res, next) => {
  const { file: { convertPath } } = req.body;
  const convertedPathName = `${convertPath.replace(/\.[^/.]+$/, "")}.mp4`;

  try {
    const result = await executeShellCommandAsync(
      `cd media && ffmpeg -hide_banner -loglevel error -i "${convertPath}" -vcodec h264 -acodec mp2 "${convertedPathName}"`
      // `cd media && test -f "${convertPath}" && echo "${convertPath} exists."`
    );

    res.json({ result, convertPath });
  } catch (error) {
    next(error);
  }
}
