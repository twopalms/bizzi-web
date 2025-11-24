<script setup lang="ts">
import { Head } from '@unhead/vue/components'
</script>

<template>
  <Head>
    <title>Bizzi | Not Found</title>
    <meta name="description" :content="`${card?.name} - Bizzi Card`" />
  </Head>

  <div class="min-h-screen flex flex-col justify-center items-center text-center">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-gray-600 text-lg mb-6">Page not found</p>
  </div>
</template>
