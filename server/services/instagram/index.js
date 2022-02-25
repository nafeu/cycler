import { promises as fs } from 'fs';
import { IgApiClient } from 'instagram-private-api';

const getAuthorizedInstagramClient = async () => {
  const client = new IgApiClient();
  client.state.generateDevice(process.env.INSTAGRAM_USERNAME);
  await client.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD);

  return client
}

export const uploadInstagramVideo = async ({ caption, videoPath, /* coverPath */ }) => {
  try {
    const instagramClient = await getAuthorizedInstagramClient();
    const video = await fs.readFile(videoPath)
    const coverImage = await fs.readFile(`${videoPath.split('.')[0]}.jpg`)

    const result = await instagramClient.publish.video({
      video,
      caption,
      coverImage
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
