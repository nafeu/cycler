const fs = require('fs');
const assert = require('assert')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// video category IDs for YouTube:
const categoryIds = {
  Entertainment: 24,
  Education: 27,
  ScienceTechnology: 28
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// function uploadVideo(auth, title, description, tags) {
//   const service = google.youtube('v3')
//   service.videos.insert({
//     auth: auth,
//     part: 'snippet,status',
//     requestBody: {
//       snippet: {
//         title,
//         description,
//         tags,
//         categoryId: categoryIds.ScienceTechnology,
//         defaultLanguage: 'en',
//         defaultAudioLanguage: 'en'
//       },
//       status: {
//         privacyStatus: "private"
//       },
//     },
//     media: {
//       body: fs.createReadStream(videoFilePath),
//     },
//   }, function(err, response) {
//     if (err) {
//       console.log('The API returned an error: ' + err);
//       return;
//     }
//     console.log(response.data)

//     console.log('Video uploaded. Uploading the thumbnail now.')
//     service.thumbnails.set({
//       auth: auth,
//       videoId: response.data.id,
//       media: {
//         body: fs.createReadStream(thumbFilePath)
//       },
//     }, function(err, response) {
//       if (err) {
//         console.log('The API returned an error: ' + err);
//         return;
//       }
//       console.log(response.data)
//     })
//   });
// }

export const getOauth2Client = () => {
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUrl  = process.env.GOOGLE_REDIRECT_URIS.split(',')[0];

  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  return oauth2Client;
}

export const getGoogleAuthUrl = () => {
  try {
    const oauth2Client = getOauth2Client();

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
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
