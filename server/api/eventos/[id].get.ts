import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID inválido'
    })
  }

  const evento = await prisma.evento.findUnique({
    where: {
      id
    },
    include: {
      _count: {
        select: {
          inscripciones: true
        }
      }
    }
  })

  if (!evento) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Evento no encontrado'
    })
  }

  return evento
})