<!-- <script setup lang="ts"> -->
<!-- import { onMounted } from 'vue' -->
<!-- import { useRouter } from 'vue-router' -->
<!---->
<!-- const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID -->
<!-- const GOOGLE_OAUTH_CALLBACK_URI = import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URI -->
<!---->
<!-- const router = useRouter() -->
<!---->
<!-- async function loginCallback(response) { -->
<!--   await fetch(GOOGLE_OAUTH_CALLBACK_URI, { -->
<!--     method: 'GET', -->
<!--     headers: { -->
<!--       Authorization: `Bearer ${response.credential}`, -->
<!--     }, -->
<!--     credentials: 'include', -->
<!--   }) -->
<!--   router.push('/cards') -->
<!-- } -->
<!---->
<!-- function initSignIn() { -->
<!--   google.accounts.id.initialize({ -->
<!--     client_id: GOOGLE_OAUTH_CLIENT_ID, -->
<!--     callback: loginCallback, -->
<!--   }) -->
<!---->
<!--   google.accounts.id.renderButton(document.getElementById('gSignInButton'), { -->
<!--     type: 'standard', -->
<!--     text: 'sign_in_with', -->
<!--     theme: 'outline', -->
<!--     size: 'large', -->
<!--     width: '350', -->
<!--   }) -->
<!--   google.accounts.id.prompt() -->
<!-- } -->
<!---->
<!-- onMounted(() => { -->
<!--   const script = document.createElement('script') -->
<!--   script.src = 'https://accounts.google.com/gsi/client' -->
<!--   script.async = true -->
<!--   script.defer = true -->
<!--   script.onload = initSignIn -->
<!--   document.head.appendChild(script) -->
<!-- }) -->
<!-- </script> -->
<!---->
<!-- <template> -->
<!--   <div id="gSignInButton" /> -->
<!-- </template> -->
<!-- // GoogleSignIn.vue -->
<!-- <script setup lang="ts"> -->
<!-- import { onMounted, ref } from 'vue' -->
<!-- import { useRouter } from 'vue-router' -->
<!---->
<!-- const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID -->
<!-- const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001' -->
<!-- const CALLBACK_URL = `${BACKEND_URL}/accounts/google/login/callback/` -->
<!---->
<!-- const router = useRouter() -->
<!-- const loading = ref(false) -->
<!-- const error = ref<string | null>(null) -->
<!---->
<!-- async function loginCallback(response: any) { -->
<!--   loading.value = true -->
<!--   error.value = null -->
<!---->
<!--   try { -->
<!--     // Send the JWT credential to your Django backend -->
<!--     const res = await fetch(CALLBACK_URL, { -->
<!--       method: 'POST', -->
<!--       headers: { -->
<!--         Authorization: `Bearer ${response.credential}`, -->
<!--       }, -->
<!--       credentials: 'include', -->
<!--     }) -->
<!---->
<!--     const data = await res.json() -->
<!---->
<!--     if (!res.ok) { -->
<!--       error.value = data.detail || data.error || 'Authentication failed' -->
<!--       console.error('Auth error:', data) -->
<!--       return -->
<!--     } -->
<!---->
<!--     // Success - redirect to your app -->
<!--     router.push('/cards') -->
<!--   } catch (err) { -->
<!--     error.value = err instanceof Error ? err.message : 'An error occurred' -->
<!--     console.error('Login error:', err) -->
<!--   } finally { -->
<!--     loading.value = false -->
<!--   } -->
<!-- } -->
<!---->
<!-- function initSignIn() { -->
<!--   google.accounts.id.initialize({ -->
<!--     client_id: GOOGLE_OAUTH_CLIENT_ID, -->
<!--     callback: loginCallback, -->
<!--   }) -->
<!---->
<!--   google.accounts.id.renderButton(document.getElementById('gSignInButton'), { -->
<!--     type: 'standard', -->
<!--     text: 'sign_in_with', -->
<!--     theme: 'outline', -->
<!--     size: 'large', -->
<!--     width: '350', -->
<!--   }) -->
<!--   google.accounts.id.prompt() -->
<!-- } -->
<!---->
<!-- onMounted(() => { -->
<!--   const script = document.createElement('script') -->
<!--   script.src = 'https://accounts.google.com/gsi/client' -->
<!--   script.async = true -->
<!--   script.defer = true -->
<!--   script.onload = initSignIn -->
<!--   document.head.appendChild(script) -->
<!-- }) -->
<!-- </script> -->
<!---->
<!-- <template> -->
<!--   <div> -->
<!--     <div v-if="error" style="color: red; margin-bottom: 10px"> -->
<!--       {{ error }} -->
<!--     </div> -->
<!--     <div v-if="loading" style="color: gray">Signing in...</div> -->
<!--     <div v-show="!loading" id="gSignInButton" /> -->
<!--   </div> -->
<!-- </template> -->

<script setup lang="ts">
import { onMounted } from 'vue'

const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)
})

function handleSignIn() {
  // This initiates the standard OAuth2 authorization code flow
  // Google will redirect to your backend's callback URL
  const redirectUri = `${BACKEND_URL}/accounts/google/login/callback/`

  // Build the Google authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.append('client_id', GOOGLE_OAUTH_CLIENT_ID)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('scope', 'openid email profile')
  authUrl.searchParams.append('access_type', 'offline')

  // Redirect to Google
  window.location.href = authUrl.toString()
}
</script>

<template>
  <div>
    <button
      @click="handleSignIn"
      style="
        padding: 12px 24px;
        font-size: 16px;
        border: 1px solid #dadce0;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Roboto', sans-serif;
      "
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Sign in with Google
    </button>
  </div>
</template>
