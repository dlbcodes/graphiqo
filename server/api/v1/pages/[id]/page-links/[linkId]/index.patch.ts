import { updatePageLinkSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);
  const pageId = getRouterParam(event, 'id');
  const linkId = getRouterParam(event, 'linkId');
  const body = await readBody(event);

  if (!pageId || !linkId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Page ID and Link ID are required.",
    });
  }

  const validatedData = updatePageLinkSchema.safeParse(body);

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data.",
      data: validatedData.error.format(),
    });
  }

  // Check ownership
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

  const updatedLink = await prisma.pageLink.update({
    where: { id: linkId },
    data: {
      ...validatedData.data,
      updatedAt: new Date(),
    },
  });

  return updatedLink;
});