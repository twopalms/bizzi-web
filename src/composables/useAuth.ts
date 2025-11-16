import { ref, computed } from 'vue'

const user = ref(null)
const isAuthenticated = computed(() => !!user.value)
const isCheckingAuth = ref(false)

const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';')
  console.log(document.cookie)
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrftoken') {
      return value
    }
  }
  return null
}

const fetchCsrfToken = async (): Promise<void> => {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/csrf`, {
      method: 'GET',
      credentials: 'include',
    })
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error)
  }
}

const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  // Ensure we have a CSRF token
  if (!getCsrfToken()) {
    await fetchCsrfToken()
  }

  const csrfToken = getCsrfToken()

  const headers = new Headers(options.headers || {})

  // Only default to JSON if there's no Content-Type AND the body is NOT FormData
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  // Always set CSRF
  headers.set('X-CSRFToken', csrfToken || '')

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  })
}

export function useAuth() {
  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      // Call backend logout API with CSRF token
      await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/auth/browser/v1/auth/session`,
        {
          method: 'DELETE',
        },
      )
    } catch (error) {
      console.error('Backend logout failed:', error)
    } finally {
      // Always clear local state regardless of backend response
      user.value = null
      localStorage.removeItem('user')
    }
  }

  const checkAuth = async (forceRefresh = false) => {
    isCheckingAuth.value = true

    try {
      // TODO: if this fails a few time, let's kill it. Otherwise a user can be
      // stuck with a false-positive auth session
      //
      if (!forceRefresh) {
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
          user.value = JSON.parse(savedUser)
          return
        }
      }

      // No local user → check with server
      const response = await makeAuthenticatedRequest(
        `${import.meta.env.VITE_API_BASE_URL}/auth/browser/v1/auth/session`,
        { method: 'GET' },
      )

      if (response.ok) {
        const sessionData = await response.json()
        user.value = sessionData
        localStorage.setItem('user', JSON.stringify(sessionData))
      } else {
        // Session invalid or expired
        user.value = null
        localStorage.removeItem('user')
      }
    } catch (error) {
      // Network error/server down → no local user either
      user.value = null
    } finally {
      isCheckingAuth.value = false
    }
  }

  return {
    user: user,
    fetchCsrfToken,
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    checkAuth,
    makeAuthenticatedRequest,
  }
}
