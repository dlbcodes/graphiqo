import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');
	const body = await readBody(event);

	// Security: Ensure chart belongs to user's dashboard
	const chart = await prisma.chart.findFirst({
		where: {
			id,
			dashboard: { profileId: user.id }
		}
	});

	if (!chart) throw createError({ statusCode: 404, message: "Chart not found" });

	return await prisma.chart.update({
		where: { id },
		data: {
			name: body.name ?? chart.name,
			type: body.type ?? chart.type,
			rawData: body.rawData ?? chart.rawData, // This saves your Excel table
			config: body.config ?? chart.config,     // This saves your ECharts styles
		},
	});
});