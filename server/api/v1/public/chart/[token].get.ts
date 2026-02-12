// server/api/public/chart/[token].get.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Token required' })
  }

  const chart = await prisma.chart.findUnique({
    where: { shareToken: token },
    select: {
      id: true,
      name: true,
      config: true, 
      rawData: true,
      isPublic: true, // We need this to check access
    }
  })

  // Security check: If it doesn't exist or isn't public, 404.
  if (!chart || !chart.isPublic) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chart not found or is private',
    })
  }

  // BUG FIX: Use chart.id for the update, NOT the token.
  // We don't 'await' this so the user gets their chart faster.
  prisma.chart.update({
    where: { id: chart.id },
    data: { publicViews: { increment: 1 } }
  }).catch(err => console.error("View count increment failed:", err))

  return chart
})