import axios from "axios";
import schema from "./schema";
import regeneratorRuntime from "regenerator-runtime";
import { promises as fs } from 'fs';

import { getGoogleAuthUrl, getGoogleTokenFromCode, getYoutubeChannelInfo } from '../../../services/google';
import { getInstagramAuthUrl } from '../../../services/instagram';
import { executeShellCommandAsync } from '../../../services/shell';

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

    let channelName = null;
    if (isGoogleAuth) {
      const channelInfo = await getYoutubeChannelInfo();
      channelName = channelInfo.items[0]?.snippet?.title || null;
    }

    authorizations.push({
      id: 'google',
      label: channelName ? `Google: @${channelName}` : 'Google',
      authorized: isGoogleAuth,
      ...getGoogleAuthUrl()
    });

    const instagramUsername = process.env.INSTAGRAM_USERNAME;
    const instagramPassword = process.env.INSTAGRAM_PASSWORD;
    const isInstagramAuth = instagramUsername && instagramPassword;

    authorizations.push({
      id: 'instagram',
      label: instagramUsername ? `Instagram: @${instagramUsername}` : 'Instagram',
      authorized: isInstagramAuth,
      ...getInstagramAuthUrl()
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

export const getAuthEnvEdit = async (req, res, next) => {
  try {
    await executeShellCommandAsync(`$EDITOR .env`);

    res.json({ success: true, message: 'Please update your .env accordingly'});
  } catch (error) {
    next(error);
  }
}
