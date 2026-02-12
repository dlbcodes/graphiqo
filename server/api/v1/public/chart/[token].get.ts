// server/api/public/chart/[token].get.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  const chart = await prisma.chart.findUnique({
    where: { id: token },
    select: {
      id: true,
      name: true,
      config: true, // Only the visual config
      rawData: true,
      // source: true,
      // Do NOT select ownerId or private metadata
    }
  })

  // if (!chart || !chart.isPublic) {
  //   throw createError({
  //     statusCode: 404,
  //     statusMessage: 'Chart not found or is private',
  //   })
  // }

  // Increment view count in the background (Don't await to keep it fast)
  // prisma.chart.update({
  //   where: { id: token },
  //   data: { publicViews: { increment: 1 } }
  // }).catch(err => console.error("View count error", err))

  return chart
})