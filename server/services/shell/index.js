import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const getSizeFromBytes = bytes => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export const getFileInfoFromFolder = route => {
  const files = fs.readdirSync(route, 'utf8');
  const response = [];

  for (let file of files) {
    const extension = file.split('.').pop();
    const size = getSizeFromBytes(fs.statSync(`${route}/${file}`).size);
    response.push({ name: file, extension, size });
  }

  return response;
}

export const executeShellCommandAsync = cmd => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }

    resolve(stdout ? stdout : stderr);
  });
});
