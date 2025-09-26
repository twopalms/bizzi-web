<script setup lang="ts">
import ActionButton from './ActionButton.vue'

defineProps({
  isEditing: Boolean,
})

defineEmits(['submitSave', 'submitEdit', 'submitCancel'])
</script>

<template>
  <div class="h-18 bg-blue-950 flex gap-4 px-6 py-4">
    <ActionButton
      v-if="isEditing"
      @click="$emit('submitCancel')"
      bgColor="#FF5F57"
      hoverColor="#9C0203"
    >
      Cancel
    </ActionButton>
    <ActionButton v-if="!isEditing" @click="$emit('submitEdit')">Edit</ActionButton>
    <ActionButton v-else @click="$emit('submitSave')">Save</ActionButton>
  </div>
</template>
