<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { $fetch } from 'ofetch'

const route = useRoute()
const id = route.params.id

const evento = ref<any>(null)

const formulario = reactive({
  nombre: '',
  email: ''
})

const mensaje = ref('')

async function cargarEvento() {
  evento.value = await $fetch(`/api/eventos/${id}`)
}

async function inscribirse() {
  mensaje.value = ''

  try {
    await $fetch(`/api/eventos/${id}/inscribir`, {
      method: 'POST',
      body: formulario
    })

    formulario.nombre = ''
    formulario.email = ''

    mensaje.value = 'Inscripción realizada correctamente.'
    await cargarEvento()
  } catch (error) {
    mensaje.value = 'No se pudo realizar la inscripción.'
  }
}

onMounted(async () => {
  await cargarEvento()
})
</script>

<template>
  <main class="min-h-screen bg-slate-100 px-6 py-8">
    <section
      v-if="evento"
      class="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow"
    >
      <NuxtLink
        to="/"
        class="text-sm font-medium text-emerald-700 hover:underline"
      >
        Volver a eventos
      </NuxtLink>

      <img
        :src="evento.imagen"
        :alt="evento.titulo"
        class="mt-4 h-72 w-full rounded-xl object-cover"
      >

      <h1 class="mt-6 text-3xl font-bold text-slate-900">
        {{ evento.titulo }}
      </h1>

      <p class="mt-2 text-slate-600">
        Fecha: {{ new Date(evento.fechaHora).toLocaleString('es-CL') }}
      </p>

      <p class="text-slate-600">
        Lugar: {{ evento.lugar }}
      </p>

      <p class="text-slate-600">
        Valor: ${{ evento.valor.toLocaleString('es-CL') }}
      </p>

      <p class="mt-2 font-semibold text-emerald-700">
        Personas inscritas: {{ evento._count.inscripciones }}
      </p>

      <form
        class="mt-8 space-y-4 rounded-xl border border-slate-200 p-5"
        @submit.prevent="inscribirse"
      >
        <h2 class="text-xl font-bold text-slate-900">
          Inscribirse al evento
        </h2>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            v-model="formulario.nombre"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            v-model="formulario.email"
            type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          >
        </div>

        <button
          type="submit"
          class="rounded-lg bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800"
        >
          Inscribirme
        </button>

        <p
          v-if="mensaje"
          class="text-sm text-emerald-700"
        >
          {{ mensaje }}
        </p>
      </form>
    </section>

    <section
      v-else
      class="mx-auto max-w-3xl rounded-xl bg-white p-6 text-center shadow"
    >
      <p class="text-slate-600">
        Cargando evento...
      </p>
    </section>
  </main>
</template>