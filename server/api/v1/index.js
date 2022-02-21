import express from 'express';
import { postTest } from "./test";
import { getMedia, getMediaPreview } from "./media";

const api = express.Router();

api.post("/test", postTest);
api.get("/media", getMedia);
api.get("/media/preview", getMediaPreview);

export default api;
