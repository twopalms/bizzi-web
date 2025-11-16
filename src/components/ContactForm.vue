<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import InputContainer from '../components/InputContainer.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const { makeAuthenticatedRequest } = useAuth()

const props = defineProps({
  cardUUID: String,
  name: String,
})

// TODO: validate email/phone
const data = ref({
  name: null,
  email: null,
  phone: null,
  job_title: null,
  company: null,
  message: null,
})

const showSubmitSuccess = ref(false)

async function submitForm() {
  const body = {
    card__uuid: props.cardUUID,
  }

  Object.assign(body, data.value)

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/contacts/`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    if (response.ok) {
      showSubmitSuccess.value = true
      return await response.json()
    } else {
      // error.value = (await response.json()).detail
      return { success: false, error: 'Failed to create card' }
    }
  } catch (err) {
    console.error(err)
    // error.value = err.toString()
  }
}
</script>

<template>
  <div class="p-6 flex flex-col gap-4 rounded-xl">
    <InputContainer
      v-model="data['name']"
      label="Name"
      placeholder="John Doe"
      element="input"
      :required="true"
    />
    <InputContainer
      v-model="data['email']"
      label="Email"
      placeholder="john.doe@gmail.com"
      element="input"
    />
    <InputContainer
      v-model="data['phone']"
      label="Phone"
      placeholder="+1 555 123 4567"
      element="input"
    />
    <InputContainer
      v-model="data['job_title']"
      label="Job Title"
      placeholder="Roofer"
      element="input"
    />
    <InputContainer
      v-model="data['company']"
      label="Company"
      placeholder="John's Roofing"
      element="input"
    />
    <InputContainer
      v-model="data['message']"
      label="Message"
      placeholder="Say hello"
      element="textarea"
    />
    <template v-if="!showSubmitSuccess">
      <p class="text-xs text-center">
        This information will only be shared with <span class="font-semibold">{{ name }}</span>
      </p>
      <AirButton @click="submitForm">Submit</AirButton>
    </template>
    <p v-else class="text-center">
      <span class="font-semibold">{{ name }}</span> has received your contact info!
    </p>
  </div>
</template>
