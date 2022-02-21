import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import helmet from "helmet";
import { join, resolve } from "path";
import 'dotenv/config';
import regeneratorRuntime from "regenerator-runtime";
import fs from "fs";

import { MEDIA_DIRECTORY } from './constants';

if (!fs.existsSync(MEDIA_DIRECTORY)){
  fs.mkdirSync(MEDIA_DIRECTORY);
}

import api from './api/v1';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('short'));
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(resolve(__dirname, 'build')));
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(join(__dirname + '/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`[ server.js ] Listening on port ${PORT}`);
});

export default app;
