import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { getMediaUrl, getPageAvatarUrl, getLinkThumbnailUrl } from "~~/server/utils/media";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');

	if (!pageId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID is required.",
		});
	}

	const page = await prisma.page.findFirst({
		where: {
			id: pageId,
			profileId: user.id,
		},
		include: {
			videoCards: {
				include: {
					ctaLinks: {
						orderBy: { order: 'asc' },
					},
				},
				orderBy: { order: 'asc' },
			},
			socialLinks: {
				orderBy: { order: 'asc' },
			},
			pageLinks: {
				orderBy: { order: 'asc' },
			},
		},
	});

	if (!page) {
		throw createError({
			statusCode: 404,
			statusMessage: "Page not found.",
		});
	}

	// Transform video cards to include computed URLs
	const pageWithUrls = {
		...page,
		avatarUrl: page.avatar
			? getPageAvatarUrl(user.id, pageId, page.avatar)
			: null,
		videoCards: page.videoCards.map(card => ({
			...card,
			videoUrl: card.videoFile
				? getMediaUrl(user.id, pageId, 'video', card.videoFile)
				: null,
			imageUrl: card.imageFile
				? getMediaUrl(user.id, pageId, 'image', card.imageFile)
				: null,
			thumbnailUrl: card.thumbnailFile
				? getMediaUrl(user.id, pageId, 'thumbnail', card.thumbnailFile)
				: null,
		})),
		pageLinks: page.pageLinks.map((link) => ({
			...link,
			// Construct thumbnail URL if it's a custom thumbnail
			thumbnailUrl: link.thumbnail
				? getLinkThumbnailUrl(user.id, pageId, link.id, link.thumbnail)
				: link.thumbnail, // Keep as-is for FAVICON or null for NONE
		})),
	};

	return pageWithUrls;
});