import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";
import fs from 'fs';
import { map } from 'lodash';

import { MEDIA_DIRECTORY } from '../../../constants';

export const getMedia = async (req, res, next) => {
  try {
    const allMedia = map(fs.readdirSync(MEDIA_DIRECTORY), mediaItem => {
      return {
        path: mediaItem,
        name: mediaItem
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