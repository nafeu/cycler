import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";

import { uploadYoutubeVideo } from '../../../services/google';

const handleStrategy = async ({ id, fields }) => {
  if (id === 'youtube') {
    return uploadYoutubeVideo(fields);
  }
}

export const postPublish = async (req, res, next) => {
  try {
    const { strategies, file } = req.body;

    // const input = { ...payload };
    // await schema.validateAsync(input);

    const results = [];

    for (const strategy of strategies) {
      const result = handleStrategy(strategy);
    }

    // const { data } = await axios.get();

    setTimeout(() => {
      res.json({ success: true });
    }, 2000);
  } catch (error) {
    next(error);
  }
};
