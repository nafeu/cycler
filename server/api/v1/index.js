import express from 'express';
import { postTest } from "./test";
import { getMedia, getMediaPreview } from "./media";
import { postPublish } from './publish';

const api = express.Router();

api.post("/test", postTest);
api.get("/media", getMedia);
api.get("/media/preview", getMediaPreview);
api.post("/publish", postPublish);

export default api;
