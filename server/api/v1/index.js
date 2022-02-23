import express from 'express';
import { getAuth, getAuthGoogle } from "./auth";
import { getMedia, getMediaPreview } from "./media";
import { postPublish } from './publish';

const api = express.Router();

api.get("/auth", getAuth);
api.get("/auth/google", getAuthGoogle);

api.get("/media", getMedia);
api.get("/media/preview", getMediaPreview);
api.post("/publish", postPublish);

export default api;
