import fsSync, { promises as fs } from 'fs';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

import { TOKEN_PATH, MEDIA_DIRECTORY } from '../../constants';

const setVideoThumbnailAsync = ({
  videoId,
  auth
}) => new Promise((resolve, reject) => {
  const service = google.youtube('v3');

  service.thumbnails.set({
    auth,
    videoId,
    media: {
      body: fsSync.createReadStream(`${MEDIA_DIRECTORY}/thumbnail-export-youtube.jpg`)
    },
  }, function(error, response) {
    if (error) {
      reject(error);
      return;
    }

    resolve(response);
  })
});

const uploadYoutubeVideoAsync = ({
  title,
  description,
  tags,
  videoPath,
  auth,
  categoryId
}) => new Promise((resolve, reject) => {
  const service = google.youtube('v3');

  service.videos.insert({
    auth,
    part: 'snippet,status',
    requestBody: {
      snippet: {
        title,
        description,
        tags,
        categoryId,
        defaultLanguage: 'en',
        defaultAudioLanguage: 'en'
      },
      status: {
        privacyStatus: "private",
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      body: fsSync.createReadStream(videoPath)
    }
  }, (error, response) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(response);
  });
});

const getYoutubeChannelInfoAsync = ({ auth }) => new Promise((resolve, reject) => {
  const service = google.youtube('v3');

  service.channels.list({
    auth,
    part: 'snippet,contentDetails,statistics',
    mine: true
  }, (error, response) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(response);
  });
});

export const uploadYoutubeVideo = async ({ title, description, tags, videoPath, categoryId /* thumbnailPath */ }) => {
  try {
    const auth = await getAuthorizedOauth2Client();

    const { data: uploadVideoResponse }  = await uploadYoutubeVideoAsync({ title, description, tags, videoPath, auth, categoryId });
    const { data: setThumbnailResponse } = await setVideoThumbnailAsync({ videoId: uploadVideoResponse.id, auth });

    return { uploadVideoResponse, setThumbnailResponse }
  } catch (error) {
    console.log(error);
    return { error }
  }
}

export const getYoutubeChannelInfo = async () => {
  try {
    const auth = await getAuthorizedOauth2Client();
    const { data: response } = await getYoutubeChannelInfoAsync({ auth });

    return response;
  } catch (error) {
    console.log(error);
    return { error }
  }
}

export const getOauth2Client = () => {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUrl  = process.env.GOOGLE_REDIRECT_URIS.split(',')[0];

  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  return oauth2Client;
}

export const getAuthorizedOauth2Client = async () => {
  const oauth2Client = getOauth2Client();

  try {
    const { google: { token: auth } } = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf-8'))
    oauth2Client.setCredentials(auth);

    return oauth2Client;
  } catch (error) {
    console.log(error);
    return oauth2Client;
  }
}

export const getGoogleAuthUrl = () => {
  try {
    const oauth2Client = getOauth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.upload'
      ]
    });

    return {
      authUrl
    };
  } catch (error) {
    return {
      error: { message: error.message }
    }
  }
}

export const getTokenAsync = code => new Promise((resolve, reject) => {
  const oauth2Client = getOauth2Client();

  oauth2Client.getToken(code, function(error, token) {
    if (error) {
      console.log(error);
      reject(error);
      return;
    }

    resolve(token);
  });
});

export const getGoogleTokenFromCode = async code => {
  try {
    const token = await getTokenAsync(code);

    return {
      token
    }
  } catch (error) {
    return {
      error: { message: error.message }
    }
  }
}
