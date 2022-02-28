import express from 'express';
import { getAuth, getAuthGoogle, getAuthEnvEdit } from "./auth";
import { getMedia, getMediaPreview, getMediaThumbs, postMediaConvert, postMediaSave } from "./media";
import { postPublish } from './publish';
import { getTest } from './test';
import { fileUploadMiddleware } from '../../services/storage';

const api = express.Router();

api.get("/test", getTest);

api.get("/auth", getAuth);
api.get("/auth/google", getAuthGoogle);
api.get("/auth/env/edit", getAuthEnvEdit)

api.get("/media", getMedia);
api.get("/media/preview", getMediaPreview);
api.get("/media/thumbs", getMediaThumbs);
api.post("/media/convert", postMediaConvert);
api.post("/media/save", fileUploadMiddleware.single('file'), postMediaSave);

api.post("/publish", postPublish);

export default api;
