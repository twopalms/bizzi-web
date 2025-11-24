<script setup lang="ts">
import { ref } from 'vue'
import AirButton from '../components/AirButton.vue'
import FormField from '../components/FormField.vue'

// ideas:
// - email card link to user
// - email QR code to user
// - email contact file to user
// - share to icloud link?

const emit = defineEmits(['submit'])

defineProps({
  cardUUID: String,
})

const showSubmitSuccess = ref(false)
const email = ref('')

function submitForm() {
  console.log('submit')
  emit('submit')
}
</script>

<template>
  <FormField label="Email">
    <input v-model.trim="email" type="text" placeholder="john.doe@gmail.com" />
  </FormField>
  <div class="p-6 flex flex-col gap-4 rounded-xl">
    <template v-if="!showSubmitSuccess">
      <AirButton @click="submitForm">Submit</AirButton>
    </template>
  </div>
</template>
