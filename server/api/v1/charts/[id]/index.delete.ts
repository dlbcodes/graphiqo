import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');

	const chart = await prisma.chart.findFirst({
		where: { id, dashboard: { profileId: user.id } }
	});

	if (!chart) throw createError({ statusCode: 404, message: "Chart not found" });

	await prisma.chart.delete({ where: { id } });
	return { success: true };
});