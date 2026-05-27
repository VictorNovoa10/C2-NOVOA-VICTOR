import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params.id as string)

  const evento = await prisma.evento.delete({
    where: { id }
  })

  return evento
})
