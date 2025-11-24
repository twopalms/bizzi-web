<script setup lang="ts">
import { ref, toRaw, watch } from 'vue'
import BizziCard from '../components/BizziCard.vue'
import CardEditForm from '../components/CardEditForm.vue'

defineEmits(['submitDelete', 'submitSave'])

const card = defineModel({ default: null })
const mutableCard = ref(null)

watch(
  card,
  (newCard) => {
    if (newCard === null) return
    mutableCard.value = structuredClone(toRaw(newCard))
  },
  { immediate: true },
)
</script>

<template>
  <div
    class="absolute inset-0 -z-10 bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px]"
  />

  <div v-if="!card" class="flex w-full h-full items-center justify-center">
    <h4 class="text-2xl">Select a card to get started</h4>
  </div>

  <div v-else class="relative flex h-full w-full">
    <div class="flex h-full w-full items-center justify-center overflow-y-auto">
      <BizziCard
        v-if="mutableCard"
        color="#4fd4d6"
        :card="mutableCard"
        class="w-120 max-w-120 max-h-[70vh] overflow-y-auto"
      />
    </div>

    <div class="h-full w-100 min-w-100 bg-gray-100 border-l-2 border-gray-300 overflow-y-auto">
      <CardEditForm
        v-model:mutableCard="mutableCard"
        v-model:referenceCard="card"
        @submit-delete="$emit('submitDelete')"
        @submit-save="$emit('submitSave')"
        class="h-full"
      />
    </div>
  </div>
</template>
