import { ref, computed } from 'vue'

const user = ref<any>(null)
const isAuthenticated = computed(() => !!user.value)
const isCheckingAuth = ref(false)

// CSRF Token utilities
const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrftoken') {
      return value
    }
  }
  return null
}

const fetchCsrfToken = async (): Promise<void> => {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/csrf`, {
      method: 'POST',
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

  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
      ...options.headers,
    },
  })
}

export function useAuth() {
  const login = (userData: any) => {
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

  // const checkAuth = async () => {
  //   isCheckingAuth.value = true
  //
  //   try {
  //     const response = await makeAuthenticatedRequest(
  //       `${import.meta.env.VITE_API_BASE_URL}/auth/browser/v1/auth/session`,
  //       {
  //         method: 'GET',
  //       },
  //     )
  //
  //     if (response.ok) {
  //       const sessionData = await response.json()
  //       user.value = sessionData
  //       localStorage.setItem('user', JSON.stringify(sessionData))
  //     } else {
  //       // Session invalid or expired
  //       user.value = null
  //       localStorage.removeItem('user')
  //     }
  //   } catch (error) {
  //     // Network error or server down - fall back to localStorage
  //     const savedUser = localStorage.getItem('user')
  //     if (savedUser) {
  //       user.value = JSON.parse(savedUser)
  //     }
  //   } finally {
  //     isCheckingAuth.value = false
  //   }
  // }

  const checkAuth = async () => {
    isCheckingAuth.value = true

    try {
      // First try localStorage
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        user.value = JSON.parse(savedUser)
        return
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
    isAuthenticated,
    isCheckingAuth,
    login,
    logout,
    checkAuth,
    makeAuthenticatedRequest,
  }
}
