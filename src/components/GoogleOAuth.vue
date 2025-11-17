<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue'

const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID

const { router } = useRouter()

async function loginCallback() {
  router.push('/cards')
}

function initSignIn() {
  google.accounts.id.initialize({
    client_id: GOOGLE_OAUTH_CLIENT_ID,
    callback: loginCallback,
  })

  google.accounts.id.renderButton(document.getElementById('gSignInButton'), {
    type: 'standard',
    text: 'sign_in_with',
    theme: 'outline',
    size: 'large',
    width: '400',
  })
  google.accounts.id.prompt()
}

onMounted(() => {
  if (typeof google !== 'undefined') {
    initSignIn()
  }
})
</script>

<template>
  <component is="script" src="https://accounts.google.com/gsi/client" @load="initSignIn" async />
  <div id="gSignInButton" />
</template>
