export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);
  const pageId = getRouterParam(event, 'id');
  const linkId = getRouterParam(event, 'linkId');

  if (!pageId || !linkId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Page ID and Link ID are required.",
    });
  }

  const pageLink = await prisma.pageLink.findFirst({
    where: {
      id: linkId,
      pageId,
      page: {
        profileId: user.id,
      },
    },
  });

  if (!pageLink) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page link not found.",
    });
  }

  await prisma.pageLink.delete({
    where: { id: linkId },
  });

  return { message: "Page link deleted successfully" };
});
