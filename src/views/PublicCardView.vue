<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import BizziCard from '../components/BizziCard.vue'
import NotFound from '../components/NotFound.vue'
import ContactForm from '../components/ContactForm.vue'
import FocusModal from '../components/FocusModal.vue'

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
  const url = `${API_BASE}/api/cards/?slug=${slug}`

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
    class="flex flex-col min-h-screen justify-center items-center"
    :style="`background-color: ${color}20`"
  >
    <main class="flex flex-col justify-center items-center flex-grow">
      <FocusModal v-model="showContactForm">
        <ContactForm :name="card?.name" />
      </FocusModal>
      <BizziCard v-if="card" :color="color" :card="card" class="w-120 max-w-120" />
      <AirButton @click="handleShareContactInfoClick" class="mt-6">
        <span
          >Connect with <span class="font-semibold">{{ card?.name }}</span></span
        >
      </AirButton>
    </main>

    <footer class="w-full text-center py-2 text-gray-700 text-sm">
      <a href="https://www.bizzicard.com" target="blank" class="hover:underline">
        Made with
        <span class="font-bold">Bizzi</span>. Get <span class="font-bold">Bizzi</span> now.
      </a>
    </footer>
  </div>
</template>
