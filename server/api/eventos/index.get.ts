import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  const eventos = await prisma.evento.findMany({
    orderBy: {
      fechaHora: 'asc'
    },
    include: {
      _count: {
        select: {
          inscripciones: true
        }
      }
    }
  })

  return eventos
})