/** Paste your URLs here — links render only when non-empty. */
export const lifeLinks = {
  /** Cornell SYSEN graduating-student spotlight (LinkedIn post). */
  linkedInSpotlight: "https://www.linkedin.com/feed/update/urn:li:activity:7460044162428743681/",
  /** Piano recital recording (YouTube, Vimeo, Drive, etc.). */
  pianoRecital: "https://youtu.be/4vQDcPI9gzk",
};

/** Thumbnail shown beside each card copy (click opens the matching lifeLinks URL). */
export const lifeMedia = {
  spotlightThumbnail: "/assets/life/linkedin-spotlight.png",
};

export function youtubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
}
