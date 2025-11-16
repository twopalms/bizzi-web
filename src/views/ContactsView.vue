<script setup lang="ts">
import parsePhoneNumber from 'libphonenumber-js'
import { useAuth } from '../composables/useAuth.ts'
import { useDateFormat } from '@vueuse/core'
import DataTable from '../components/DataTable.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const { makeAuthenticatedRequest } = useAuth()

async function fetchContacts(limit, offset, ordering, search) {
  let url = `${API_BASE}/contacts/?&limit=${limit}&offset=${offset}&ordering=${ordering}`

  if (search) {
    url = `${url}&search=${search}`
  }

  try {
    const resp = await makeAuthenticatedRequest(url, { method: 'GET' })

    if (resp.ok) {
      return await resp.json()
    } else {
      // todo: error handling
      console.warn('Failed to load directory')
    }
  } catch (err) {
    console.error(err)
  }
}

function formatPhone(val) {
  try {
    return parsePhoneNumber(val).formatInternational()
  } catch {
    return val
  }
}
</script>

<template>
  <div class="w-full h-full p-12 flex flex-col">
    <h2 class="text-3xl font-semibold">My Contacts</h2>
    <DataTable
      :columns="['name', 'email', 'phone', 'job_title', 'company', 'created_at']"
      :columnNames="['Name', 'Email', 'Phone', 'Job Title', 'Company', 'Created On']"
      :fetch="fetchContacts"
      :limitChoices="[5, 10, 25, 50, 100]"
      :formatters="{ created_at: (val) => useDateFormat(val, 'YYYY-MM-DD'), phone: formatPhone }"
    />
  </div>
</template>
