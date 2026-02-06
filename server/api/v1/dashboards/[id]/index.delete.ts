import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');

	// Ownership check
	const dashboard = await prisma.dashboard.findFirst({
		where: { id, profileId: user.id }
	});

	if (!dashboard) throw createError({ statusCode: 404, message: "Not found" });

	await prisma.dashboard.delete({
		where: { id }
	});

	return { message: "Dashboard deleted successfully" };
});