export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const linkId = getRouterParam(event, 'linkId');

	if (!pageId || !linkId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID and Link ID are required.",
		});
	}

	const socialLink = await prisma.socialLink.findFirst({
		where: {
			id: linkId,
			pageId,
			page: {
				profileId: user.id,
			},
		},
	});

	if (!socialLink) {
		throw createError({
			statusCode: 404,
			statusMessage: "Social link not found.",
		});
	}

	await prisma.socialLink.delete({
		where: { id: linkId },
	});

	return { message: "Social link deleted successfully" };
});