<script setup lang="ts">
import { ref } from 'vue'
import AirButton from '../components/AirButton.vue'
import InputContainer from '../components/InputContainer.vue'

defineProps({
  name: {
    type: String,
  },
})

// TODO: make this a max height and allow scrolling

const data = ref({
  name: null,
  email: null,
  phone: null,
  job_title: null,
  company: null,
  message: null,
})
</script>

<template>
  <div class="p-6 flex flex-col gap-4 rounded-xl">
    <InputContainer v-model="data['name']" label="Name" placeholder="John Doe" element="input" />
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
    <p class="text-xs text-center">
      This information will only be shared with <span class="font-semibold">{{ name }}</span>
    </p>
    <AirButton>Submit</AirButton>
  </div>
</template>
