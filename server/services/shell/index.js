import { exec } from 'child_process';

export const executeShellCommandAsync = cmd => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      reject(error);
    }

    resolve(stdout ? stdout : stderr);
  });
});
