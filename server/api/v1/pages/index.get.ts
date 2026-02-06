import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { getMediaUrl, getPageAvatarUrl, getLinkThumbnailUrl } from "~~/server/utils/media";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);

	const pages = await prisma.page.findMany({
		where: { profileId: user.id },
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
		orderBy: { createdAt: 'desc' },
	});



	const pagesWithUrls = pages.map((page) => ({
		...page,
		avatarUrl: page.avatar
			? getPageAvatarUrl(user.id, page.id, page.avatar)
			: null,
		videoCards: page.videoCards.map((card) => ({
			...card,
			videoUrl: card.videoFile
				? getMediaUrl(user.id, page.id, "video", card.videoFile)
				: null,
			imageUrl: card.imageFile
				? getMediaUrl(user.id, page.id, "image", card.imageFile)
				: null,
			thumbnailUrl: card.thumbnailFile
				? getMediaUrl(user.id, page.id, "thumbnail", card.thumbnailFile)
				: null,
		})),
		pageLinks: page.pageLinks.map((link) => ({
			...link,
			thumbnailUrl: link.thumbnail
				? getLinkThumbnailUrl(user.id, page.id, link.id, link.thumbnail)
				: link.thumbnail,
		})),
	}));

	return pagesWithUrls;


});