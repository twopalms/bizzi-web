<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue'
import { Head } from '@unhead/vue/components'

async function handleLogin() {
  console.log('submit')
}
</script>

<template>
  <div class="h-full w-full flex justify-center">
    <Head>
      <title>Login | Bizzi</title>
      <meta name="description" content="Bizzi Login Page" />
    </Head>
    <div class="flex flex-col w-100 items-center justify-center gap-8">
      <h1 class="text-2xl text-center">Log In</h1>
      <AuthForm @submit="handleLogin" label="Login" />
      <p>
        Need to create an account?
        <router-link to="/signup" class="underline text-blue-500 hover:cursor-pointer"
          >Sign Up</router-link
        >
        instead.
      </p>
    </div>
  </div>
</template>
