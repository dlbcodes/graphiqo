import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');

	const dashboard = await prisma.dashboard.findFirst({
		where: {
			id,
			profileId: user.id
		},
		include: {
			charts: {
				include: { brandProfile: true }
			}
		}
	});

	if (!dashboard) {
		throw createError({ statusCode: 404, message: "Dashboard not found" });
	}

	return dashboard;
});