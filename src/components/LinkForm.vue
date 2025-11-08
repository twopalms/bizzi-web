<script setup lang="ts">
import { onMounted, ref } from 'vue'
import draggable from 'vuedraggable'
import LinkEditor from '../components/LinkEditor.vue'
import AirButton from '../components/AirButton.vue'

const links = defineModel()
const editing = ref([])

const addLinkEnabled = ref(true)

function addLink() {
  links.value.unshift({ name: '', url: '' })
  addLinkEnabled.value = false
  editing.value[0] = true
}

function handleSubmitDelete(index: number) {
  links.value.splice(index, 1)
  editing.value.splice(index, 1)
  addLinkEnabled.value = true
}

function handleSubmitDone() {
  addLinkEnabled.value = true
}

onMounted(() => {
  editing.value = links.value.map(() => false)
})
</script>

<template>
  <AirButton @click="addLink" :enabled="addLinkEnabled">Add Link</AirButton>

  <draggable
    v-model="links"
    item-key="id"
    handle=".drag-handle"
    tag="ol"
    class="flex flex-col gap-1"
    :animation="150"
  >
    <template #item="{ index }">
      <li class="border border-gray-500 rounded-lg shadow bg-gray-50 p-3">
        <div class="flex items-center gap-2">
          <i
            v-if="!editing[index]"
            class="pi pi-bars cursor-grab active:cursor-grabbing drag-handle mr-2"
          ></i>
          <div class="w-full">
            <LinkEditor
              @submit-delete="() => handleSubmitDelete(index)"
              @submit-done="handleSubmitDone"
              v-model:name="links[index].name"
              v-model:url="links[index].url"
              v-model:editing="editing[index]"
            />
          </div>
        </div>
      </li>
    </template>
  </draggable>
</template>
