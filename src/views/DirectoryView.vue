<script setup lang="ts">
// TODO:
// - ordering icons
// - links to public business card

import { computed, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import parsePhoneNumber from 'libphonenumber-js'
import DropDownMenu from '../components/DropDownMenu.vue'
import { useAuth } from '../composables/useAuth.ts'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const { makeAuthenticatedRequest } = useAuth()

const loading = ref(true)
const items = ref([])
const count = ref(0)
const offset = ref(0)
const searchText = ref('')

const columnKeys = ['name', 'job_title', 'company', 'location']

// phone / email / website
const sortColumn = ref(null)
const sortDirection = ref('')
const limitChoices = [25, 50, 100]

// TODO: store user's choice in local storage once chosen
const limitChoiceIndex = ref(1)

const limit = computed(() => {
  return limitChoices[limitChoiceIndex.value]
})

const ordering = computed(() => {
  if (sortColumn.value === null) {
    return '-created_at'
  }

  let field = columnKeys[sortColumn.value]

  return `${sortDirection.value}${field}`
})

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

const pageEnd = computed(() => {
  return Math.min(limit.value + offset.value, count.value)
})

function pageRight() {
  const nextOffset = Math.min(offset.value + limit.value, count.value)
  if (nextOffset == count.value) return

  offset.value = nextOffset
}

function pageLeft() {
  offset.value = Math.max(offset.value - limit.value, 0)
}

function handleClickHeader(i) {
  if (sortColumn.value == i) {
    if (sortDirection.value == '') {
      sortDirection.value = '-'
      sortColumn.value = i
    } else if (sortDirection.value == '-') {
      sortDirection.value = ''
      sortColumn.value = null
    }
  } else {
    sortColumn.value = i
  }
}

async function refreshPage() {
  const resp = await fetchDirectory(limit.value, offset.value, ordering.value, searchText.value)
  items.value = resp.items
  count.value = resp.count
  loading.value = false
}

watch([limit, offset, ordering], async () => {
  await refreshPage()
})

watchDebounced(
  searchText,
  async () => {
    await refreshPage()
  },
  { debounce: 500 },
)

onMounted(async () => {
  await refreshPage()
})
</script>

<template>
  <div v-if="!loading" class="w-full h-full p-12 flex flex-col">
    <h2 class="text-3xl font-semibold">Public Directory</h2>

    <div class="flex justify-between items-center">
      <input
        v-model="searchText"
        type="text"
        placeholder="Search"
        class="border border-black rounded-md p-2 my-4"
      />
      <div class="flex items-center gap-6">
        <div class="flex items-center hover:cursor-pointer">
          <span>Items per page:</span>
          <DropDownMenu :choices="limitChoices" :width="25" v-model="limitChoiceIndex" />
        </div>
        <span>{{ offset + 1 }}-{{ pageEnd }} of {{ count }}</span>
        <i @click="pageLeft" class="pi pi-chevron-left hover:cursor-pointer" />
        <i @click="pageRight" class="pi pi-chevron-right hover:cursor-pointer" />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto rounded-lg border border-gray-300 shadow-md">
      <table class="min-w-full">
        <thead class="bg-blue-200 sticky top-0">
          <tr>
            <th
              @click="handleClickHeader(i)"
              v-for="(key, i) in columnKeys"
              :key="key"
              class="px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-blue-300/60 hover:cursor-pointer select-none"
            >
              {{ titleCase(key) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            class="hover:bg-blue-100 hover:cursor-pointer even:bg-gray-100 odd:bg-gray-50"
          >
            <td v-for="key in columnKeys" :key="key" class="px-4 py-2 text-sm text-gray-800">
              {{ formatCell(item, key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
