import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');
	const body = await readBody(event);

	// Verify ownership first
	const existing = await prisma.dashboard.findFirst({
		where: { id, profileId: user.id }
	});

	if (!existing) throw createError({ statusCode: 404, message: "Not found" });

	return await prisma.dashboard.update({
		where: { id },
		data: {
			title: body.title ?? existing.title,
			isPublic: body.isPublic ?? existing.isPublic,
			slug: body.slug ?? existing.slug,
		},
	});
});