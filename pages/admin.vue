<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { $fetch } from 'ofetch'

const eventos = ref<any[]>([])

const nuevoEvento = reactive({
  titulo: '',
  fechaHora: '',
  lugar: '',
  imagen: '',
  valor: 0
})

const eventoSeleccionado = ref<any>(null)
const inscritos = ref<any[]>([])
const mensaje = ref('')

async function cargarEventos() {
  eventos.value = await $fetch('/api/eventos')
}

async function crearEvento() {
  mensaje.value = ''

  try {
    await $fetch('/api/eventos', {
      method: 'POST',
      body: nuevoEvento
    })

    nuevoEvento.titulo = ''
    nuevoEvento.fechaHora = ''
    nuevoEvento.lugar = ''
    nuevoEvento.imagen = ''
    nuevoEvento.valor = 0

    mensaje.value = 'Evento creado correctamente.'
    await cargarEventos()
  } catch (error) {
    mensaje.value = 'Error al crear el evento.'
  }
}

async function verInscritos(evento: any) {
  eventoSeleccionado.value = evento
  inscritos.value = await $fetch(`/api/eventos/${evento.id}/inscritos`)
}

async function borrarInscripcion(id: number) {
  await $fetch(`/api/inscripciones/${id}`, {
    method: 'DELETE'
  })

  if (eventoSeleccionado.value) {
    await verInscritos(eventoSeleccionado.value)
  }

  await cargarEventos()
}

async function eliminarEvento(id: number) {
  if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
    try {
      await $fetch(`/api/eventos/${id}`, {
        method: 'DELETE'
      })
      
      mensaje.value = 'Evento eliminado correctamente.'
      eventoSeleccionado.value = null
      inscritos.value = []
      await cargarEventos()
    } catch (error) {
      mensaje.value = 'Error al eliminar el evento.'
    }
  }
}

onMounted(async () => {
  await cargarEventos()
})
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section class="mx-auto max-w-6xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">
            Panel de administración
          </h1>
          <p class="text-slate-600">
            Crear eventos, revisar inscritos y eliminar inscripciones.
          </p>
        </div>

        <NuxtLink
          to="/"
          class="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        >
          Volver al inicio
        </NuxtLink>
      </div>

      <form
        class="mb-8 grid gap-4 rounded-xl bg-white p-6 shadow md:grid-cols-2"
        @submit.prevent="crearEvento"
      >
        <h2 class="text-xl font-bold text-slate-900 md:col-span-2">
          Agregar evento
        </h2>

        <input
          v-model="nuevoEvento.titulo"
          type="text"
          placeholder="Título del evento"
          class="rounded-lg border border-slate-300 px-3 py-2"
          required
        >

        <input
          v-model="nuevoEvento.fechaHora"
          type="datetime-local"
          class="rounded-lg border border-slate-300 px-3 py-2"
          required
        >

        <input
          v-model="nuevoEvento.lugar"
          type="text"
          placeholder="Lugar"
          class="rounded-lg border border-slate-300 px-3 py-2"
          required
        >

        <input
          v-model="nuevoEvento.imagen"
          type="url"
          placeholder="URL de imagen"
          class="rounded-lg border border-slate-300 px-3 py-2"
          required
        >

        <input
          v-model="nuevoEvento.valor"
          type="number"
          placeholder="Valor"
          class="rounded-lg border border-slate-300 px-3 py-2"
        >

        <button
          type="submit"
          class="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Guardar evento
        </button>

        <p
          v-if="mensaje"
          class="text-sm text-emerald-700 md:col-span-2"
        >
          {{ mensaje }}
        </p>
      </form>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="rounded-xl bg-white p-6 shadow">
          <h2 class="mb-4 text-xl font-bold text-slate-900">
            Eventos publicados
          </h2>

          <p
            v-if="!eventos || eventos.length === 0"
            class="text-slate-600"
          >
            Aún no hay eventos registrados.
          </p>

          <div v-else class="space-y-3">
            <article
              v-for="evento in eventos"
              :key="evento.id"
              class="rounded-lg border border-slate-200 p-4"
            >
              <h3 class="font-bold text-slate-900">
                {{ evento.titulo }}
              </h3>

              <p class="text-sm text-slate-600">
                {{ new Date(evento.fechaHora).toLocaleString('es-CL') }}
              </p>

              <p class="text-sm text-slate-600">
                Lugar: {{ evento.lugar }}
              </p>

              <p class="text-sm font-semibold text-emerald-700">
                Inscritos: {{ evento._count.inscripciones }}
              </p>

              <div class="mt-3 flex gap-2">
                <button
                  class="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-700"
                  @click="verInscritos(evento)"
                >
                  Ver inscritos
                </button>

                <button
                  class="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                  @click="eliminarEvento(evento.id)"
                >
                  Eliminar
                </button>
              </div>
            </article>
          </div>
        </section>

        <section class="rounded-xl bg-white p-6 shadow">
          <h2 class="mb-4 text-xl font-bold text-slate-900">
            Personas inscritas
          </h2>

          <p
            v-if="!eventoSeleccionado"
            class="text-slate-600"
          >
            Selecciona un evento para ver sus inscritos.
          </p>

          <div v-else>
            <h3 class="mb-4 font-semibold text-emerald-700">
              Evento: {{ eventoSeleccionado.titulo }}
            </h3>

            <p
              v-if="inscritos.length === 0"
              class="text-slate-600"
            >
              Este evento aún no tiene inscritos.
            </p>

            <div
              v-for="persona in inscritos"
              :key="persona.id"
              class="mb-3 flex items-center justify-between rounded-lg border border-slate-200 p-3"
            >
              <div>
                <p class="font-medium text-slate-900">
                  {{ persona.nombre }}
                </p>
                <p class="text-sm text-slate-600">
                  {{ persona.email }}
                </p>
              </div>

              <button
                class="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                @click="borrarInscripcion(persona.id)"
              >
                Borrar
              </button>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>