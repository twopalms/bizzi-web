<script setup lang="ts">
import { onUnmounted, toRaw, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCardManager } from '../composables/useCardManager.ts'
import ActionButton from '../components/ActionButton.vue'
import BizziCard from '../components/BizziCard.vue'
// import CardDetailHeader from '../components/CardDetailHeader.vue'
import CardEditForm from '../components/CardEditForm.vue'

const route = useRoute()
const router = useRouter()
const { activeCard, cardList, deleteCard, setActiveCard } = useCardManager()

const hasPendingChanges = ref(false)
const mutableCard = ref(null)

function handleReset() {
  mutableCard.value = structuredClone(toRaw(activeCard.value))
}

function handleSave() {
  console.log('TODO: Save Card')
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
      // TODO: check if pending changes, and if so, ask for confirmation
      setActiveCard(index)
    }
  },
  { immediate: true },
)

// TODO: debounce this for performance??
watch(
  mutableCard,
  (newCard) => {
    hasPendingChanges.value = JSON.stringify(newCard) !== JSON.stringify(activeCard.value)
  },
  { deep: true },
)

onUnmounted(() => {
  setActiveCard(null)
})
</script>

<template>
  <div class="w-full h-screen">
    <div
      class="absolute -z-10 inset-0 h-full w-full bg-[radial-gradient(circle,#73737350_1px,transparent_1px)] bg-[size:10px_10px]"
    />

    <div class="flex h-full">
      <div class="flex flex-grow overflow-y-auto items-center justify-center">
        <BizziCard
          v-if="activeCard"
          color="#4fd4d6"
          :card="activeCard"
          :mutableCard="mutableCard"
        />
      </div>
      <div
        class="w-100 justify-self-end overscroll-none overflow-y-auto bg-gray-100 border-l-2 border-gray-300"
      >
        <div
          class="flex justify-between items-center h-18 bg-gray-200 px-4 sticky top-0 z-10 border-b border-gray-300"
        >
          <h4>Edit your card below</h4>
          <div class="flex gap-2">
            <ActionButton @click="handleReset" :enabled="hasPendingChanges"> Reset </ActionButton>
            <ActionButton @click="handleSave" :enabled="hasPendingChanges"> Save </ActionButton>
          </div>
        </div>
        <CardEditForm v-if="mutableCard" v-model="mutableCard" @submit-delete="handleDelete" />
      </div>
    </div>
  </div>
</template>
