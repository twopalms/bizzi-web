const getCsrfToken = (): string | null => {
  const cookies = document.cookie.split(';')
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
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/csrf`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch (error) {
    // TODO: add UI error popup
    console.error('Failed to fetch CSRF token:', error)
  }
}

export function useCSRF() {
  return {
    getCsrfToken,
    fetchCsrfToken,
  }
}
