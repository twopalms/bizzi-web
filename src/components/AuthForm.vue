<script setup lang="ts">
import { computed, ref } from 'vue'
import AirButton from '../components/AirButton.vue'
import FormField from '../components/FormField.vue'
import GoogleOAuth from '../components/GoogleOAuth.vue'

defineEmits(['submit'])
defineProps({ label: String })

const email = defineModel('email')
const password = defineModel('password')
const showPassword = ref('')

const passwordInputType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

function validateEmail() {
  return ''
}

function validatePassword() {
  return ''
}

const emailError = computed(() => {
  return validateEmail(email.value)
})

const passwordError = computed(() => {
  return validatePassword(password.value)
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex flex-col gap-4 border rounded-lg p-4 bg-gray-100">
      <FormField label="Email">
        <input v-model.trim="email" type="email" />
        <small v-if="emailError" class="text-red-800">{{ emailError }}</small>
      </FormField>
      <FormField label="Password">
        <input v-model.trim="password" :type="passwordInputType || 'password'" />
        <small v-if="passwordError" class="text-red-800">{{ passwordError }}</small>
      </FormField>
      <div class="flex gap-3 hover:cursor-pointer">
        <input v-model="showPassword" type="checkbox" class="hover:cursor-pointer" />
        <label
          @click="showPassword = !showPassword"
          class="font-medium select-none hover:cursor-pointer"
          >Show Password</label
        >
      </div>
    </div>
    <AirButton @click="$emit('submit')" class="text-lg font-semibold">{{ label }}</AirButton>
    <div class="text-center">
      <span>or</span>
    </div>
    <GoogleOAuth />
  </div>
</template>
