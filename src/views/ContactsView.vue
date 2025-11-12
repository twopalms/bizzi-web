<script setup lang="ts">
import { useAuth } from '../composables/useAuth.ts'
import DataTable from '../components/DataTable.vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const { makeAuthenticatedRequest } = useAuth()

async function fetchContacts(limit, offset, ordering, search) {
  let url = `${API_BASE}/api/contacts/?&limit=${limit}&offset=${offset}&ordering=${ordering}`

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
</script>

<template>
  <div class="w-full h-full p-12 flex flex-col">
    <h2 class="text-3xl font-semibold">My Contacts</h2>
    <DataTable
      :columns="['name', 'email', 'phone_fmt', 'job_title', 'company', 'message']"
      :columnNames="['Name', 'Email', 'Phone', 'Job Title', 'Company', 'Message']"
      :fetch="fetchContacts"
      :limitChoices="[5, 10, 25, 50, 100]"
    />
  </div>
</template>
