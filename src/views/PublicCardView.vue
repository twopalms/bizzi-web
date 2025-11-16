<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import BizziCard from '../components/BizziCard.vue'
import NotFound from '../components/NotFound.vue'
import ContactForm from '../components/ContactForm.vue'

// TODO: if the card owner has a paid account, remove branding
// TODO: add color to the card options - color ref is placeholder
// TODO: make contact CTA configurable
const API_BASE = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const { makeAuthenticatedRequest } = useAuth()

const card = ref(null)
const color = '#4fd4d6'
const loading = ref(true)
const notFound = ref(false)
const showContactForm = ref(false)

async function fetchPublicCard() {
  const slug = route.params.slug
  const url = `${API_BASE}/cards/?slug=${slug}`

  try {
    const resp = await makeAuthenticatedRequest(url, { method: 'GET' })

    if (resp.ok) {
      const data = await resp.json()
      if (data.count == 0) {
        notFound.value = true
        return null
      } else if (data.count == 1) {
        return data.items[0]
      } else {
        console.error('I did something wrong')
      }
    } else {
      console.warn('Error loading card')
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function handleShareContactInfoClick() {
  showContactForm.value = !showContactForm.value
}

onMounted(async () => {
  card.value = await fetchPublicCard()
})
</script>

<template>
  <NotFound v-if="notFound" />
  <div
    v-else-if="!loading"
    class="flex flex-col flex-grow items-center justify-between min-h-screen"
    :style="`background-color: ${color}20`"
  >
    <div>
      <BizziCard
        v-if="card && !showContactForm"
        :color="color"
        :card="card"
        class="w-120 max-w-120 max-h-[70vh] overflow-y-auto mt-[10vh]"
      />
      <ContactForm
        v-else-if="card && showContactForm"
        :cardUUID="card.uuid"
        :name="card?.name"
        class="w-120 max-w-120 max-h-[70vh] overflow-y-auto mt-[10vh] bg-white border border-black"
      />
      <div class="flex justify-center mt-4">
        <AirButton @click="handleShareContactInfoClick" class="mb-6 min-w-60">
          <span v-if="!showContactForm"
            >Connect with <span class="font-semibold">{{ card?.name }}</span></span
          >
          <span v-else>View Card</span>
        </AirButton>
      </div>
    </div>
    <footer class="w-full text-center mb-4 text-gray-700 text-sm">
      <a href="https://www.bizzicard.com" target="blank" class="hover:underline">
        Made with
        <span class="font-bold">Bizzi</span>. Get <span class="font-bold">Bizzi</span> now.
      </a>
    </footer>
  </div>
</template>
