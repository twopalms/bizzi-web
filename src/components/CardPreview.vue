<script setup lang="ts">
interface Card {
  name?: string
  job_title?: string
  company?: string
}

interface Props {
  card: Card
}

defineProps<Props>()
</script>

<template>
  <div
    class="p-4 min-h-30 shadow-md rounded-md flex flex-col justify-between bg-white border border-blue-200 hover:border-blue-500"
  >
    <div class="font-semibold">{{ card.name || 'Untitled Card' }}</div>
    <div>
      <div v-if="card.job_title" class="font-medium">{{ card.job_title }}</div>
      <div v-if="card.company">{{ card.company }}</div>
    </div>
  </div>
</template>
