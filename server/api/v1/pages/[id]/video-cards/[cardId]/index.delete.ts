export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const cardId = getRouterParam(event, 'cardId');

	const videoCard = await prisma.videoCard.findFirst({
		where: {
			id: cardId,
			pageId,
			page: {
				profileId: user.id,
			},
		},
	});

	if (!videoCard) {
		throw createError({
			statusCode: 404,
			statusMessage: "Video card not found.",
		});
	}

	// Delete all associated files - SUPER CLEAN!
	const filesToDelete = [];

	if (videoCard.videoFile) {
		filesToDelete.push(`${user.id}/pages/${pageId}/videos/${videoCard.videoFile}`);
	}
	if (videoCard.imageFile) {
		filesToDelete.push(`${user.id}/pages/${pageId}/images/${videoCard.imageFile}`);
	}
	if (videoCard.thumbnailFile) {
		filesToDelete.push(`${user.id}/pages/${pageId}/thumbnails/${videoCard.thumbnailFile}`);
	}

	await Promise.all(filesToDelete.map(key => deleteS3File(key)));

	await prisma.videoCard.delete({
		where: { id: cardId },
	});

	return { message: "Video card and files deleted successfully" };
});