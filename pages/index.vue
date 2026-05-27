<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { $fetch } from 'ofetch'

const eventos = ref<any[]>([])
const cargando = ref(true)

async function cargarEventos() {
  cargando.value = true

  try {
    eventos.value = await $fetch('/api/eventos')
  } catch (error) {
    eventos.value = []
  } finally {
    cargando.value = false
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
            Smart Events
          </h1>
          <p class="text-slate-600">
            Plataforma de eventos estudiantiles y culturales.
          </p>
        </div>

        <NuxtLink
          to="/admin"
          class="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Panel staff
        </NuxtLink>
      </div>

      <button
        class="mb-6 rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
        @click="cargarEventos()"
      >
        Actualizar eventos
      </button>

      <p v-if="cargando" class="text-slate-600">
        Cargando eventos...
      </p>

      <div
        v-else-if="eventos && eventos.length > 0"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="evento in eventos"
          :key="evento.id"
          class="overflow-hidden rounded-xl bg-white shadow"
        >
          <img
            :src="evento.imagen"
            :alt="evento.titulo"
            class="h-48 w-full object-cover"
          >

          <div class="p-5">
            <h2 class="text-xl font-bold text-slate-900">
              {{ evento.titulo }}
            </h2>

            <p class="mt-2 text-sm text-slate-600">
              Fecha: {{ new Date(evento.fechaHora).toLocaleString('es-CL') }}
            </p>

            <p class="text-sm text-slate-600">
              Lugar: {{ evento.lugar }}
            </p>

            <p class="text-sm text-slate-600">
              Valor: ${{ evento.valor.toLocaleString('es-CL') }}
            </p>

            <p class="mt-2 font-semibold text-emerald-700">
              Inscritos: {{ evento._count.inscripciones }}
            </p>

            <NuxtLink
              :to="`/eventos/${evento.id}`"
              class="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
            >
              Ver detalle
            </NuxtLink>
          </div>
        </article>
      </div>

      <div
        v-else
        class="rounded-xl bg-white p-6 text-center shadow"
      >
        <p class="text-slate-600">
          Aún no hay eventos publicados.
        </p>
        <NuxtLink
          to="/admin"
          class="mt-4 inline-block rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Crear primer evento
        </NuxtLink>
      </div>
    </section>
  </main>
</template>