<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth.ts'
import AirButton from '../components/AirButton.vue'
import FormField from '../components/FormField.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL
const { makeAuthenticatedRequest } = useAuth()

const emit = defineEmits(['submit'])

const props = defineProps({
  cardUUID: String,
  name: String,
})

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

  // TODO: validate data and update error message if not valid

  try {
    const response = await makeAuthenticatedRequest(`${API_BASE}/contacts/`, {
      method: 'POST',
      body: JSON.stringify(body),
    })

    if (response.ok) {
      showSubmitSuccess.value = true
      emit('submit')
      return await response.json()
    } else {
      return { success: false, error: 'Failed to create card' }
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="p-6 flex flex-col gap-4 rounded-xl">
    <FormField label="Name" :required="true">
      <input v-model.trim="data['name']" type="text" placeholder="John Doe" />
    </FormField>
    <FormField label="Email">
      <input v-model.trim="data['email']" type="text" placeholder="john.doe@gmail.com" />
    </FormField>
    <FormField label="Phone">
      <input v-model.trim="data['phone']" type="text" placeholder="+1 555 123 4567" />
    </FormField>
    <FormField label="Job Title">
      <input v-model.trim="data['job_title']" type="text" placeholder="Roofer" />
    </FormField>
    <FormField label="Company">
      <input v-model.trim="data['company']" type="text" placeholder="John's Roofing" />
    </FormField>
    <FormField label="Message">
      <textarea v-model.trim="data['message']" rows="5" placeholder="Say hello" />
    </FormField>
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
