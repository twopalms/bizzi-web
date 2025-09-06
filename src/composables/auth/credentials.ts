import { ref } from 'vue'

export function useAuthForm() {
  const form = ref({
    email: '',
    password: '',
  })

  const errors = ref({
    email: '',
    password: '',
    general: '',
  })

  const isLoading = ref(false)

  const clearErrors = () => {
    errors.value = {
      email: '',
      password: '',
      general: '',
    }
  }

  return { form, errors, isLoading, clearErrors }
}
