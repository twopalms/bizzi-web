<script setup lang="ts">
import { onUnmounted, toRaw, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCardManager } from '../composables/useCardManager.ts'
import BizziCard from '../components/BizziCard.vue'
import CardDetailHeader from '../components/CardDetailHeader.vue'
import CardEditForm from '../components/CardEditForm.vue'

const route = useRoute()
const router = useRouter()
const { activeCard, cardList, setActiveCard } = useCardManager()

const isEditing = ref(false)
const mutableCard = ref(null)

function handleCancel() {
  isEditing.value = false
  mutableCard.value = structuredClone(toRaw(activeCard.value))
}

function handleSave() {
  console.log('TODO: Save Card')
  isEditing.value = false
}

async function handleDelete() {
  await deleteCard(route.params.id)
  router.push('/cards')
}

watch(
  activeCard,
  (newCard) => {
    mutableCard.value = structuredClone(toRaw(newCard))
  },
  { initial: true },
)

watch(
  () => [route.params.id, cardList.value],
  ([newId]) => {
    if (cardList.value.length > 0) {
      const index = cardList.value.findIndex((element) => element.uuid == newId)
      // TODO: check if editing, and if so, ask for confirmation
      isEditing.value = false
      setActiveCard(index)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  setActiveCard(null)
})
</script>

<template>
  <div class="w-full h-screen flex flex-col">
    <CardDetailHeader
      @submit-edit="() => (isEditing = true)"
      @submit-cancel="handleCancel"
      @submit-delete="handleDelete"
      @submit-save="handleSave"
      :isEditing="isEditing"
    />

    <div class="flex flex-1 min-h-0">
      <div class="flex flex-2 items-center justify-center min-h-0">
        <div class="w-full h-full overflow-y-auto py-6 pl-6 pr-3">
          <BizziCard
            v-if="activeCard"
            color="#4fd4d6"
            :card="activeCard"
            :mutableCard="mutableCard"
            :showMutable="isEditing"
          />
        </div>
      </div>

      <div
        v-if="isEditing"
        class="flex-2 h-full overflow-y-auto bg-gray-100 border-l-2 border-gray-300 pl-3 pb-20"
      >
        <CardEditForm v-if="mutableCard" v-model="mutableCard" />
      </div>
    </div>
  </div>
</template>
