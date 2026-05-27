import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const eventoId = Number(getRouterParam(event, 'id'))

  if (!eventoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de evento inválido'
    })
  }

  const inscritos = await prisma.inscripcion.findMany({
    where: {
      eventoId
    },
    orderBy: {
      nombre: 'asc'
    }
  })

  return inscritos
})