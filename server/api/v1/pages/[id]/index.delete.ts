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
	});

	if (!page) {
		throw createError({
			statusCode: 404,
			statusMessage: "Page not found.",
		});
	}

	await prisma.page.delete({
		where: { id: pageId },
	});

	return { message: "Page deleted successfully" };
});