<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import AirButton from '../components/AirButton.vue'
import DropDownMenu from '../components/DropDownMenu.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const props = defineProps({
  columns: Array<string>,
  columnNames: Array<string>,
  fetch: {
    default: async () => {
      return []
    },
  },
  limitChoices: {
    type: Array<number>,
    default: [25, 50, 100],
  },
  formatters: {
    default: () => {},
  },
})

const loading = ref(true)
const items = ref([])
const count = ref(0)
const offset = ref(0)
const searchText = ref('')
const limitMenuExpanded = ref(false)

const sortColumn = ref(null)
const sortDirection = ref('')

// TODO: store user's choice in local storage once chosen
const limitChoiceIndex = ref(1)

const limit = computed(() => {
  return props.limitChoices[limitChoiceIndex.value]
})

const ordering = computed(() => {
  if (sortColumn.value === null) {
    return '-created_at'
  }

  const field = props.columns[sortColumn.value]
  return `${sortDirection.value}${field}`
})

function formatCell(item: object, key: string) {
  if (!props.formatters) return item[key]

  const formatter = props.formatters[key]
  if (!formatter) return item[key]

  return formatter(item[key])
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
  const resp = await props.fetch(limit.value, offset.value, ordering.value, searchText.value)
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
  <template v-if="!loading">
    <div class="flex justify-between items-center z-10">
      <input v-model="searchText" type="text" placeholder="Search" class="flex p-2 my-4 mr-8" />
      <div class="flex items-center gap-6">
        <AirButton @click="limitMenuExpanded = !limitMenuExpanded">
          <div class="flex items-center hover:cursor-pointer">
            <span>Items per page:</span>
            <DropDownMenu
              v-model:expanded="limitMenuExpanded"
              v-model:index="limitChoiceIndex"
              :choices="limitChoices"
              :width="25"
            />
          </div>
        </AirButton>
        <span>{{ offset == 0 ? offset : offset + 1 }}-{{ pageEnd }} of {{ count }}</span>
        <AirButton @click="pageLeft">{{ '<' }}</AirButton>
        <AirButton @click="pageRight">{{ '>' }}</AirButton>
      </div>
    </div>

    <div class="flex overflow-y-auto rounded-lg border border-gray-300 shadow-md z-0">
      <table class="min-w-full">
        <thead class="bg-blue-200 sticky top-0">
          <tr>
            <th
              @click="handleClickHeader(i)"
              v-for="(key, i) in columns"
              :key="key"
              class="px-4 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-blue-300/60 hover:cursor-pointer select-none"
            >
              {{ columnNames[i] }}
              <i
                v-if="sortColumn == i"
                class="pi ml-2"
                :class="sortDirection == '-' ? 'pi-arrow-down' : 'pi-arrow-up'"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, i) in items"
            :key="i"
            class="hover:bg-blue-100 hover:cursor-pointer even:bg-gray-100 odd:bg-gray-50"
          >
            <td v-for="key in columns" :key="key" class="px-4 py-2 text-sm text-gray-800">
              {{ formatCell(item, key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  <div v-else>
    <LoadingSpinner />
  </div>
</template>
