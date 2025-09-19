<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCards } from '../composables/useCards.ts'
import BizziCard from '../components/BizziCard.vue'
import CardDetailHeader from '../components/CardDetailHeader.vue'
import CardEditForm from '../components/CardEditForm.vue'

const router = useRouter()
const { card, deleteCard } = useCards()

const isEditing = ref(false)

function toggleIsEditing() {
  isEditing.value = !isEditing.value
}

// function setIsEditingFalse() {
//   console.log(card.value)
//   isEditing.value = false
// }

async function handleDelete() {
  await deleteCard(route.params.id)
  router.push('/cards')
}

// watch(
//   () => card,
//   () => setIsEditingFalse(),
// )
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <CardDetailHeader
      @toggle-is-editing="toggleIsEditing"
      @submit-delete="handleDelete"
      :isEditing="isEditing"
    />

    <div class="flex flex-1 min-h-0">
      <div class="flex flex-2 items-center justify-center min-h-0">
        <div class="w-full h-full overflow-y-auto py-6 pl-6 pr-3">
          <BizziCard color="#4fd4d6" />
        </div>
      </div>

      <div v-if="isEditing" class="flex-2 h-full overflow-y-auto py-6 pr-6 pl-3">
        <CardEditForm />
      </div>
    </div>
  </div>
</template>
