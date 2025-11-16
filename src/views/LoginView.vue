<script setup lang="ts">
import AuthForm from '../components/AuthForm.vue'

async function handleLogin() {
  console.log('submit')
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-8 items-center justify-center">
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
</template>
