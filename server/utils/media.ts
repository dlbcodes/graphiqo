export function getMediaUrl(
  userId: string,
  pageId: string,
  type: "video" | "image" | "thumbnail" | "avatar",
  fileName: string
): string {
  const folderMap: Record<typeof type, string> = {
    video: "videos",
    image: "images",
    thumbnail: "thumbnails",
    avatar: "avatar",
  };

  return `${process.env.CLOUDFRONT_URL}/${userId}/pages/${pageId}/${folderMap[type]}/${fileName}`;
}

export function getAvatarUrl(userId: string, fileName: string): string {
  return `${process.env.CLOUDFRONT_URL}/${userId}/avatar/${fileName}`;
}

export function getPageAvatarUrl(userId: string, pageId: string, fileName: string): string {
  return `${process.env.CLOUDFRONT_URL}/${userId}/pages/${pageId}/avatar/${fileName}`;
}

export function getLinkThumbnailUrl(userId: string, pageId: string, linkId: string, fileName: string): string {
  return `${process.env.CLOUDFRONT_URL}/${userId}/pages/${pageId}/links/${linkId}/thumbnails/${fileName}`;
}