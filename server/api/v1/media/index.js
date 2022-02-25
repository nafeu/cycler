import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";
import fs from 'fs';
import { filter, map, includes } from 'lodash';

import { executeShellCommandAsync, getFileInfoFromFolder } from '../../../services/shell';

import { MEDIA_DIRECTORY } from '../../../constants';


export const getMedia = async (req, res, next) => {
  try {
    let files = getFileInfoFromFolder(MEDIA_DIRECTORY);

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

    const allMedia = map(files, ({ name, size }) => {
      return {
        path: name,
        name,
        size
      }
    })

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
