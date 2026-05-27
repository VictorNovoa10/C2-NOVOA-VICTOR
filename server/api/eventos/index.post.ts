import { defineEventHandler, readBody, createError } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.titulo || !body.fechaHora || !body.lugar || !body.imagen) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan datos obligatorios'
    })
  }

  const nuevoEvento = await prisma.evento.create({
    data: {
      titulo: String(body.titulo),
      fechaHora: new Date(body.fechaHora),
      lugar: String(body.lugar),
      imagen: String(body.imagen),
      valor: Number(body.valor) || 0
    }
  })

  return nuevoEvento
})