// pages/AuthError.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const error = ref<string>('')
const details = ref<string>('')

onMounted(() => {
  // Get error from query params
  const errorParam = route.query.error as string

  if (errorParam) {
    error.value = errorParam

    // Try to parse if it's JSON
    try {
      const parsed = JSON.parse(decodeURIComponent(errorParam))
      details.value = JSON.stringify(parsed, null, 2)
    } catch {
      details.value = errorParam
    }
  } else {
    error.value = 'Unknown error'
  }

  // Log everything for debugging
  console.error('Auth Error:', {
    error: error.value,
    details: details.value,
    fullUrl: route.fullPath,
    queryParams: route.query,
  })
})

function goBack() {
  router.push('/login')
}
</script>

<template>
  <div style="padding: 40px; max-width: 600px; margin: 0 auto">
    <h1>Authentication Error</h1>

    <div style="background: #fee; padding: 20px; border-radius: 4px; margin: 20px 0">
      <p style="margin: 0; color: #c00"><strong>Error:</strong> {{ error }}</p>
    </div>

    <div
      v-if="details"
      style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0"
    >
      <p style="margin-top: 0; font-weight: bold">Details:</p>
      <pre style="margin: 10px 0; overflow-x: auto; font-size: 12px">{{ details }}</pre>
    </div>

    <div style="margin-top: 30px">
      <button
        @click="goBack"
        style="
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
      >
        Back to Login
      </button>
    </div>
  </div>
</template>
