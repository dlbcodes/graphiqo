import { prisma } from "~~/server/utils/prisma";

/**
 * Helper to construct media URLs
 */
function getMediaUrl(
  userId: string,
  pageId: string,
  type: "videos" | "images" | "thumbnails" | "avatar",
  fileName: string
): string {
  return `${process.env.CLOUDFRONT_URL}/${userId}/pages/${pageId}/${type}/${fileName}`;
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Slug is required",
    });
  }

  const page = await prisma.page.findFirst({
    where: {
      slug,
      isPublished: true, // 👈 strongly recommended
    },
    include: {
      videoCards: {
        // where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          ctaLinks: {
            // where: { isPublished: true },
            orderBy: { order: "asc" },
          },
        },
      },
      socialLinks: {
        // where: { isPublished: true },
        orderBy: { order: "asc" },
      },
      pageLinks: {
        // where: { isPublished: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  const userId = page.profileId;
  const pageId = page.id;

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    bio: page.bio,

    avatarUrl: page.avatar
      ? getMediaUrl(userId, pageId, "avatar", page.avatar)
      : null,

    socialLinks: page.socialLinks,
    pageLinks: page.pageLinks,

    videoCards: page.videoCards.map((card) => ({
      id: card.id,
      title: card.title,
      description: card.description,

      videoUrl: card.videoFile
        ? getMediaUrl(userId, pageId, "videos", card.videoFile)
        : null,

      imageUrl: card.imageFile
        ? getMediaUrl(userId, pageId, "images", card.imageFile)
        : null,

      thumbnailUrl: card.thumbnailFile
        ? getMediaUrl(userId, pageId, "thumbnails", card.thumbnailFile)
        : null,

      ctaLinks: card.ctaLinks,
    })),
  };
});
