<script setup lang="ts">
import { onUnmounted, toRaw, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCardManager } from '../composables/useCardManager.ts'
import AirButton from '../components/AirButton.vue'
import BizziCard from '../components/BizziCard.vue'
import CardEditForm from '../components/CardEditForm.vue'

const route = useRoute()
const router = useRouter()
const {
  activeCard,
  cardList,
  deleteCard,
  patchCard,
  setActiveCard,
  uploadProfilePicture,
  deleteProfilePicture,
} = useCardManager()

const hasPendingChanges = ref(false)
const mutableCard = ref(null)

function handleReset() {
  mutableCard.value = structuredClone(toRaw(activeCard.value))
}

async function handleSave() {
  // If picture is an object, we know its a pending upload
  if (!mutableCard.value.picture) {
    if (activeCard.value.picture) {
      await deleteProfilePicture()
    }
  } else if (typeof mutableCard.value.picture === 'object') {
    await uploadProfilePicture(mutableCard.value.picture)
  }

  await patchCard(mutableCard.value)
}

async function handleDelete() {
  // TODO: add confirmation modal
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
  <div class="flex w-full h-full">
    <div class="flex flex-grow flex-col overflow-y-auto items-center justify-center px-12 pt-30">
      <div class="pb-10">
        <BizziCard v-if="activeCard" color="#4fd4d6" :card="mutableCard" class="w-120 max-w-120" />
      </div>
    </div>
    <div
      class="w-min-100 w-max-100 w-100 justify-self-end overscroll-none overflow-y-auto bg-gray-100 border-l-2 border-gray-300"
    >
      <div
        class="flex justify-between items-center h-18 bg-gray-200 px-4 sticky top-0 z-10 border-b border-gray-300"
      >
        <h4>Edit your card below</h4>
        <div class="flex gap-2">
          <AirButton @click="handleReset" :enabled="hasPendingChanges"> Reset </AirButton>
          <AirButton @click="handleSave" :enabled="hasPendingChanges" bgColor="#86d196">
            Save
          </AirButton>
        </div>
      </div>
      <CardEditForm v-if="mutableCard" v-model="mutableCard" @submit-delete="handleDelete" />
    </div>
  </div>
</template>
