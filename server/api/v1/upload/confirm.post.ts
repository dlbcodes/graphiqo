import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	console.log('🔍 Upload confirm received:', {
		type: body.type,
		fileName: body.fileName,
		pageId: body.pageId,
		cardId: body.cardId,
		linkId: body.linkId,
	});

	const { type, fileName, pageId, cardId, linkId } = body;

	if (!type || !fileName) {
		throw createError({
			statusCode: 400,
			message: "Missing required fields: type, fileName",
		});
	}

	try {
		switch (type) {
			// ========================================
			// PROFILE AVATAR
			// ========================================
			case "avatar":
				const oldProfile = await prisma.profile.findUnique({
					where: { id: user.id },
					select: { avatar: true },
				});

				if (oldProfile?.avatar) {
					const oldKey = `${user.id}/avatar/${oldProfile.avatar}`;
					await deleteS3File(oldKey);
				}

				await prisma.profile.update({
					where: { id: user.id },
					data: { avatar: fileName }, // Just filename
				});
				break;

			// ========================================
			// PAGE AVATAR
			// ========================================
			case "page-avatar":
				if (!pageId) {
					throw createError({
						statusCode: 400,
						message: "pageId is required for page avatar upload",
					});
				}

				const pageForAvatar = await prisma.page.findFirst({
					where: {
						id: pageId,
						profileId: user.id,
					},
					select: { avatar: true },
				});

				if (!pageForAvatar) {
					throw createError({
						statusCode: 404,
						message: "Page not found or access denied",
					});
				}

				if (pageForAvatar.avatar) {
					const oldKey = `${user.id}/pages/${pageId}/avatar/${pageForAvatar.avatar}`;
					await deleteS3File(oldKey);
					console.log('🗑️ Deleted old page avatar:', oldKey);
				}

				await prisma.page.update({
					where: { id: pageId },
					data: { avatar: fileName }, // Just filename
				});

				console.log('✅ Page avatar updated:', fileName);
				break;

			// ========================================
			// VIDEO CARD MEDIA
			// ========================================
			case "page-video":
			case "page-image":
			case "page-thumbnail":
				if (!pageId) {
					throw createError({
						statusCode: 400,
						message: "pageId is required for page media uploads",
					});
				}

				const page = await prisma.page.findFirst({
					where: {
						id: pageId,
						profileId: user.id,
					},
				});

				if (!page) {
					throw createError({
						statusCode: 404,
						message: "Page not found or access denied",
					});
				}

				let videoCard;

				if (cardId) {
					videoCard = await prisma.videoCard.findFirst({
						where: {
							id: cardId,
							pageId: pageId,
						},
					});

					if (!videoCard) {
						throw createError({
							statusCode: 404,
							message: "Video card not found",
						});
					}

					console.log('✅ Found existing card:', videoCard.id);
				} else {
					const maxOrderCard = await prisma.videoCard.findFirst({
						where: { pageId },
						orderBy: { order: 'desc' },
						select: { order: true },
					});

					const nextOrder = (maxOrderCard?.order ?? -1) + 1;

					videoCard = await prisma.videoCard.create({
						data: {
							pageId,
							order: nextOrder,
							isActive: true,
						},
					});

					console.log('✅ Created new VideoCard:', {
						id: videoCard.id,
						order: videoCard.order,
					});
				}

				let oldFileName: string | null = null;
				let folder = "";

				if (type === "page-video") {
					oldFileName = videoCard.videoFile;
					folder = "videos";
				} else if (type === "page-image") {
					oldFileName = videoCard.imageFile;
					folder = "images";
				} else if (type === "page-thumbnail") {
					oldFileName = videoCard.thumbnailFile;
					folder = "thumbnails";
				}

				if (oldFileName) {
					const oldKey = `${user.id}/pages/${pageId}/${folder}/${oldFileName}`;
					await deleteS3File(oldKey);
					console.log('🗑️ Deleted old file:', oldKey);
				}

				const updateData: any = { updatedAt: new Date() };

				if (type === "page-video") updateData.videoFile = fileName; // Just filename
				if (type === "page-image") updateData.imageFile = fileName; // Just filename
				if (type === "page-thumbnail") updateData.thumbnailFile = fileName; // Just filename

				console.log('💾 Updating card with:', updateData);

				const updatedCard = await prisma.videoCard.update({
					where: { id: videoCard.id },
					data: updateData,
				});

				console.log('✅ Card updated successfully:', {
					id: updatedCard.id,
					videoFile: updatedCard.videoFile,
					imageFile: updatedCard.imageFile,
					thumbnailFile: updatedCard.thumbnailFile,
				});

				return {
					success: true,
					message: cardId ? "Upload confirmed and saved" : "VideoCard created and file uploaded",
					data: {
						fileName,
						cardId: updatedCard.id,
						created: !cardId,
					},
				};

			// ========================================
			// PAGE LINK THUMBNAIL
			// ========================================
			case "page-link-thumbnail":
				if (!pageId || !linkId) {
					throw createError({
						statusCode: 400,
						message: "pageId and linkId are required for page-link-thumbnail upload",
					});
				}

				const pageForLinkThumb = await prisma.page.findFirst({
					where: {
						id: pageId,
						profileId: user.id,
					},
				});

				if (!pageForLinkThumb) {
					throw createError({
						statusCode: 404,
						message: "Page not found or access denied",
					});
				}

				const pageLink = await prisma.pageLink.findFirst({
					where: {
						id: linkId,
						pageId: pageId,
					},
					select: {
						thumbnail: true,
						thumbnailType: true,
					},
				});

				if (!pageLink) {
					throw createError({
						statusCode: 404,
						message: "Page link not found",
					});
				}

				// Delete old thumbnail if exists and it's a custom one
				if (pageLink.thumbnail && pageLink.thumbnailType === 'CUSTOM') {
					try {
						// thumbnail is now just a filename
						const oldKey = `${user.id}/pages/${pageId}/links/${linkId}/thumbnails/${pageLink.thumbnail}`;
						await deleteS3File(oldKey);
						console.log('🗑️ Deleted old page link thumbnail:', oldKey);
					} catch (error) {
						console.error('Failed to delete old thumbnail:', error);
					}
				}

				// Save just the filename
				await prisma.pageLink.update({
					where: { id: linkId },
					data: {
						thumbnail: fileName, // Just filename, not full URL
						thumbnailType: 'CUSTOM',
					},
				});

				console.log('✅ Page link thumbnail updated:', fileName);
				break;

			default:
				throw createError({
					statusCode: 400,
					message: `Unsupported upload type: ${type}`,
				});
		}

		return {
			success: true,
			message: "Upload confirmed and saved",
			data: {
				fileName,
			},
		};
	} catch (error) {
		console.error("❌ Failed to confirm upload:", error);
		throw createError({
			statusCode: 500,
			message: error instanceof Error ? error.message : "Failed to confirm upload",
		});
	}
});