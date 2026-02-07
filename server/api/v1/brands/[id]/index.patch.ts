import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const id = getRouterParam(event, 'id');
	const body = await readBody(event);

	// Verify ownership before update
	return await prisma.brandProfile.update({
		where: { id, profileId: user.id },
		data: body
	});
});