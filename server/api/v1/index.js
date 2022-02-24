import express from 'express';
import { getAuth, getAuthGoogle, getAuthEnvEdit } from "./auth";
import { getMedia, getMediaPreview } from "./media";
import { postPublish } from './publish';
import { getTest } from './test';

const api = express.Router();

api.get("/test", getTest);

api.get("/auth", getAuth);
api.get("/auth/google", getAuthGoogle);
api.get("/auth/env/edit", getAuthEnvEdit)

api.get("/media", getMedia);
api.get("/media/preview", getMediaPreview);
api.post("/publish", postPublish);

export default api;
