import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { createPageLinkSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event);
  const pageId = getRouterParam(event, 'id');
  const body = await readBody(event);

  if (!pageId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Page ID is required.",
    });
  }

  const validatedData = createPageLinkSchema.safeParse(body);

  if (!validatedData.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid data.",
      data: validatedData.error.format(),
    });
  }

  // Check page ownership
  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      profileId: user.id,
    },
  });

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found.",
    });
  }

  const pageLink = await prisma.pageLink.create({
    data: {
      ...validatedData.data,
      pageId,
    },
  });

  return pageLink;
});