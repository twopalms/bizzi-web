<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useCardManager } from '../composables/useCardManager.ts'
import parsePhoneNumber from 'libphonenumber-js'
import DropDownMenu from '../components/DropDownMenu.vue'

const { fetchDirectory } = useCardManager()

const loading = ref(true)
const items = ref([])
const count = ref(0)

const offset = ref(0)

// phone / email / website
const visibleKeys = ['name', 'job_title', 'company', 'location']
const limitChoices = [5, 10, 25, 50, 100]

// TODO: store user's choice in local storage once chosen
const limitChoiceIndex = ref(3)

const limit = computed(() => {
  return limitChoices[limitChoiceIndex.value]
})

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

// TODO:
// - make a bunch of fake data to test pagination
// - links to public business card
// - alternate table rows with gray/white
// - search!

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

async function refreshPage() {
  const resp = await fetchDirectory(limit.value, offset.value)
  items.value = resp.items
  count.value = resp.count
  loading.value = false
}

watch([limit, offset], async () => {
  await refreshPage()
})

onMounted(async () => {
  await refreshPage()
})
</script>

<template>
  <div v-if="!loading" class="w-full h-full p-12">
    <h2 class="text-3xl font-semibold">Public Directory</h2>
    <div class="flex justify-between items-center">
      <input type="text" placeholder="Search" class="border border-black rounded-md p-2 my-4" />
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
    <table class="min-w-full">
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
          class="hover:bg-blue-100 hover:cursor-pointer transition-colors even:bg-gray-100 odd:bg-gray-50"
        >
          <td v-for="key in visibleKeys" :key="key" class="px-4 py-2 text-sm text-gray-800">
            {{ formatCell(item, key) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
