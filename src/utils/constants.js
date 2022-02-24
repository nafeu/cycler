export const DEFAULT_PAYLOAD = {
  mediaType: null,
  destinations: [],
  strategies: [],
  file: {}
}

export const MEDIA_TYPE_VIDEO = 'video';
export const MEDIA_TYPE_IMAGE = 'image';

export const VALID_MEDIA_TYPES = [MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGE];

export const YOUTUBE_STRATEGY_ID   = 'youtube';
export const INSTAGRAM_STRATEGY_ID = 'instagram';
export const TWITTER_STRATEGY_ID   = 'twitter';

export const GOOGLE_AUTH_ID = 'google'

export const FIRST_ITEM = 0;

export const EVENT_STATE_CHANGED = "state_changed";

export const YOUTUBE_VIDEO_CATEGORIES = [
  { value: 1, label: 'Film & Animation' },
  { value: 2, label: 'Autos & Vehicles' },
  { value: 10, label: 'Music' },
  { value: 15, label: 'Pets & Animals' },
  { value: 17, label: 'Sports' },
  { value: 19, label: 'Travel & Events' },
  { value: 20, label: 'Gaming' },
  { value: 22, label: 'People & Blogs' },
  { value: 23, label: 'Comedy' },
  { value: 24, label: 'Entertainment' },
  { value: 25, label: 'News & Politics' },
  { value: 26, label: 'Howto & Style' },
  { value: 27, label: 'Education' },
  { value: 28, label: 'Science & Technology' },
  { value: 29, label: 'Nonprofits & Activism' }
];
