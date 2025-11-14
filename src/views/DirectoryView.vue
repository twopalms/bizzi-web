<script setup lang="ts">
// TODO:
// - ordering icons
// - links to public business card

import parsePhoneNumber from 'libphonenumber-js'
import { useAuth } from '../composables/useAuth.ts'
import DataTable from '../components/DataTable.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const { makeAuthenticatedRequest } = useAuth()

async function fetchDirectory(limit, offset, ordering, search) {
  let url = `${API_BASE}/api/cards/?public=true&limit=${limit}&offset=${offset}&ordering=${ordering}`

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
    <h2 class="text-3xl font-semibold">Public Directory</h2>
    <DataTable
      :columns="['name', 'job_title', 'company', 'phone', 'location']"
      :columnNames="['Name', 'Job Title', 'Company', 'Phone', 'Location']"
      :fetch="fetchDirectory"
      :limitChoices="[25, 50, 100]"
      :formatters="{ phone: formatPhone }"
    />
  </div>
</template>
