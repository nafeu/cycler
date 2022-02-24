import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";

import { uploadYoutubeVideo } from '../../../services/google';
import { uploadInstagramVideo } from '../../../services/instagram';

const handleStrategy = async ({ strategy, file }) => {
  const { id, fields } = strategy;

  if (id === 'youtube') {
    return uploadYoutubeVideo({ ...fields, videoPath: `media/${file.localPath}` });
  }

  if (id === 'instagram') {
    return await uploadInstagramVideo({ ...fields, videoPath: `media/${file.localPath}` });
  }
}

export const postPublish = async (req, res, next) => {
  try {
    const { strategies, file } = req.body;

    const results = [];

    for (const strategy of strategies) {
      const result = await handleStrategy({ strategy, file });

      results.push(result);
    }

    res.json({ results });
  } catch (error) {
    next(error);
  }
};
