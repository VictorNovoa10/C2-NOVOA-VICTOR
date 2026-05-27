import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import prisma from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const eventoId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!eventoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de evento inválido'
    })
  }

  if (!body.nombre || !body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nombre y email son obligatorios'
    })
  }

  const eventoExiste = await prisma.evento.findUnique({
    where: {
      id: eventoId
    }
  })

  if (!eventoExiste) {
    throw createError({
      statusCode: 404,
      statusMessage: 'El evento no existe'
    })
  }

  const nuevaInscripcion = await prisma.inscripcion.create({
    data: {
      nombre: body.nombre,
      email: body.email,
      eventoId
    }
  })

  return nuevaInscripcion
})