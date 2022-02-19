import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import regeneratorRuntime from "regenerator-runtime";

import api from './api/v1';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(morgan('short'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'client/build')));
app.use('/api', api);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`[ server.js ] Listening on port ${PORT}`);
});

export default app;
