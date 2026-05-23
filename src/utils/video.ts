export function extractVideoId(url: string): { platform: "youtube" | "vimeo"; id: string } | null {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  );
  if (youtubeMatch) {
    return { platform: "youtube", id: youtubeMatch[1] };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return { platform: "vimeo", id: vimeoMatch[1] };
  }

  return null;
}
