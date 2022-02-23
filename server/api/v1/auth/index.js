import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";
import { promises as fs } from 'fs';

import { getGoogleAuthUrl, getGoogleTokenFromCode } from '../../../services/google';

import { TOKEN_PATH } from '../../../constants';

const exists = async path => {
  try {
    await fs.access(path)
    return true;
  } catch {
    return false;
  }
}

export const getAuth = async (req, res, next) => {
  try {
    const hasTokens = await exists(TOKEN_PATH);

    if (!hasTokens) {
      await fs.writeFile(TOKEN_PATH, JSON.stringify({}));
    }

    const authorizations = []

    const tokens = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));

    const isGoogleAuth = !!tokens.google && !tokens.google.error;

    authorizations.push({
      id: 'google',
      label: 'Google',
      authorized: isGoogleAuth,
      ...getGoogleAuthUrl()
    });

    res.json(authorizations);
  } catch (error) {
    res.json({ error: error.message });
  }
};

export const getAuthGoogle = async (req, res, next) => {
  const { code, scope } = req.query;

  try {
    const auth = await getGoogleTokenFromCode(code);

    const existingTokens = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'));
    const updatedTokens  = { ...existingTokens, google: auth };

    await fs.writeFile(TOKEN_PATH, JSON.stringify(updatedTokens));

    setTimeout(() => {
      res.redirect(301, 'http://localhost:3000');
    }, 3000);
  } catch (error) {
    res.json({ error })
  }
}
