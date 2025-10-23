<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useCardManager } from '../composables/useCardManager.ts'
import parsePhoneNumber from 'libphonenumber-js'

const { fetchDirectory } = useCardManager()

const loading = ref(true)
const items = ref([])
const count = ref(0)

const visibleKeys = ['name', 'job_title', 'company', 'location', 'phone']

function titleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatCell(item: object, key: string) {
  let value = item[key]

  if (key === 'phone') {
    try {
      value = parsePhoneNumber(value).formatNational()
    } catch {
      console.warn('unable to parse phone number')
    }
  }
  return value
}

onMounted(async () => {
  const resp = await fetchDirectory()
  items.value = resp.items
  count.value = resp.count
  loading.value = false
})
</script>

<template>
  <div class="w-full h-full p-12">
    <h2 class="text-3xl font-semibold pb-4">Directory</h2>
    <table v-if="!loading" class="min-w-full">
      <thead class="bg-blue-200 border-b border-b-gray-500">
        <tr>
          <th
            v-for="key in visibleKeys"
            :key="key"
            class="px-4 py-2 text-left text-sm font-semibold text-gray-700"
          >
            {{ titleCase(key) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in items"
          :key="i"
          class="hover:bg-gray-100 hover:cursor-pointer transition-colors"
        >
          <td v-for="key in visibleKeys" :key="key" class="px-4 py-2 text-sm text-gray-800">
            {{ formatCell(item, key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
