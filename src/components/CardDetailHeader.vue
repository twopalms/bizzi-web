<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCards } from '../composables/useCards.ts'
import ActionButton from './ActionButton.vue'

const route = useRoute()
const router = useRouter()
const isEditing = ref(false)

function toggleIsEditing() {
  isEditing.value = !isEditing.value
}

const { deleteCard } = useCards()

async function handleDeleteClick() {
  await deleteCard(route.params.id)
  router.push('/cards')
}
</script>

<template>
  <div class="h-18 bg-blue-950 flex justify-between gap-4 px-6 py-4">
    <ActionButton v-if="!isEditing" @click="toggleIsEditing" text="Edit" />
    <ActionButton v-else @click="toggleIsEditing" text="Save" />
    <ActionButton @click="handleDeleteClick" bgColor="#FF5F57" hoverColor="#9C0203" text="Delete" />
  </div>
</template>
