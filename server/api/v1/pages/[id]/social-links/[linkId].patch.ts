import { updateSocialLinkSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const linkId = getRouterParam(event, 'linkId');
	const body = await readBody(event);



	if (!pageId || !linkId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID and Link ID are required.",
		});
	}

	const validatedData = updateSocialLinkSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	// Check ownership through page
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

	const updatedLink = await prisma.socialLink.update({
		where: { id: linkId },
		data: {
			...validatedData.data,
			updatedAt: new Date(),
		},
	});

	return updatedLink;
});
