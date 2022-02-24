import { promises as fs } from 'fs';
import { IgApiClient } from 'instagram-private-api';

const getAuthorizedInstagramClient = async () => {
  const client = new IgApiClient();
  client.state.generateDevice(process.env.IG_USERNAME);
  await client.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  return client
}

export const uploadInstagramVideo = async ({ caption, videoPath, /* coverPath */ }) => {
  try {
    const instagramClient = await getAuthorizedInstagramClient();

    const result = await ig.publish.video({
      video: await fs.readFile(videoPath),
      caption
      // coverImage: await fs.readFile(coverPath),
    });

    return result;
  } catch (error) {
    console.log(error);
    return { error }
  }
}

export const getInstagramAuthUrl = () => {
  return { authUrl: 'http://localhost:8000/api/auth/env/edit' }
}
