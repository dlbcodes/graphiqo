import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";
import { deleteS3File } from "~~/server/utils/s3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');

	console.log(user)

	if (!pageId) {
		throw createError({
			statusCode: 400,
			message: "Page ID is required",
		});
	}

	try {
		// Verify ownership and get current avatar
		const page = await prisma.page.findFirst({
			where: {
				id: pageId,
				profileId: user.id,
			},
			select: { avatar: true },
		});

		if (!page) {
			throw createError({
				statusCode: 404,
				message: "Page not found or access denied",
			});
		}

		if (!page.avatar) {
			throw createError({
				statusCode: 404,
				message: "No avatar to delete",
			});
		}

		// Delete from S3
		const s3Key = `${user.id}/pages/${pageId}/avatar/${page.avatar}`;
		await deleteS3File(s3Key);
		console.log('🗑️ Deleted page avatar from S3:', s3Key);

		// Clear from database
		await prisma.page.update({
			where: { id: pageId },
			data: { avatar: null },
		});

		console.log('✅ Page avatar deleted');

		return {
			success: true,
			message: "Page avatar deleted successfully",
		};
	} catch (error) {
		console.error("❌ Failed to delete page avatar:", error);

		if (error.statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			message: "Failed to delete page avatar",
		});
	}
});