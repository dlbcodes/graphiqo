import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	// Verify the user owns the dashboard they are adding a chart to
	const dashboard = await prisma.dashboard.findFirst({
		where: { id: body.dashboardId, profileId: user.id }
	});

	if (!dashboard) throw createError({ statusCode: 403, message: "Unauthorized" });

	return await prisma.chart.create({
		data: {
			dashboardId: body.dashboardId,
			name: body.name || "Untitled Chart",
			type: body.type || "bar",
			rawData: [], // Empty V1 state
			config: { theme: 'default', annotations: [] },
		},
	});
});