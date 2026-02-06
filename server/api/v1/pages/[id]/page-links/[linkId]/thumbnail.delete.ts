import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";
import { deleteS3File } from "~~/server/utils/s3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const linkId = getRouterParam(event, 'linkId');

	if (!pageId || !linkId) {
		throw createError({
			statusCode: 400,
			message: "Page ID and Link ID are required",
		});
	}

	try {
		// Verify ownership and get current thumbnail
		const link = await prisma.pageLink.findFirst({
			where: {
				id: linkId,
				pageId: pageId,
				page: {
					profileId: user.id,
				},
			},
			select: {
				thumbnailType: true,
				thumbnailUrl: true,
			},
		});

		if (!link) {
			throw createError({
				statusCode: 404,
				message: "Link not found or access denied",
			});
		}

		if (link.thumbnailType === 'NONE' || !link.thumbnailUrl) {
			throw createError({
				statusCode: 404,
				message: "No thumbnail to delete",
			});
		}

		// Only delete from S3 if it's a custom uploaded thumbnail
		// (not external URLs)
		if (link.thumbnailType === 'CUSTOM' && link.thumbnailUrl) {
			// Check if it's an S3 file (not external URL)
			// Assuming your uploaded thumbnails are stored with a specific pattern
			const isS3File = link.thumbnailUrl.includes(user.id) ||
				!link.thumbnailUrl.startsWith('http://') &&
				!link.thumbnailUrl.startsWith('https://');

			if (isS3File) {
				// Extract filename from URL or use thumbnailUrl as key
				const fileName = link.thumbnailUrl.split('/').pop() || link.thumbnailUrl;
				const s3Key = `${user.id}/pages/${pageId}/link-thumbnails/${fileName}`;

				try {
					await deleteS3File(s3Key);
					console.log('🗑️ Deleted link thumbnail from S3:', s3Key);
				} catch (s3Error) {
					console.warn('⚠️ Could not delete from S3 (might be external URL):', s3Error);
				}
			}
		}

		// Clear from database
		await prisma.pageLink.update({
			where: { id: linkId },
			data: {
				thumbnailType: 'NONE',
				thumbnailUrl: null,
			},
		});

		console.log('✅ Link thumbnail deleted');

		return {
			success: true,
			message: "Thumbnail deleted successfully",
		};
	} catch (error) {
		console.error("❌ Failed to delete thumbnail:", error);

		if (error.statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			message: "Failed to delete thumbnail",
		});
	}
});