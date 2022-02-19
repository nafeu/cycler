import express from 'express';
import { postTest } from "./test";

const api = express.Router();

api.post("/test", postTest);

export default api;
