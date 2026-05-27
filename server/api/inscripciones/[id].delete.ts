import { defineEventHandler, getRouterParam, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de inscripción inválido'
    })
  }

  const inscripcionExiste = await prisma.inscripcion.findUnique({
    where: {
      id
    }
  })

  if (!inscripcionExiste) {
    throw createError({
      statusCode: 404,
      statusMessage: 'La inscripción no existe'
    })
  }

  await prisma.inscripcion.delete({
    where: {
      id
    }
  })

  return {
    mensaje: 'Inscripción eliminada correctamente'
  }
})