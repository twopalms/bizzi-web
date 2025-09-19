<script setup lang="ts">
import ActionButton from './ActionButton.vue'

defineProps({
  isEditing: Boolean,
})

defineEmits(['toggleIsEditing', 'submitDelete'])
</script>

<template>
  <div class="h-18 bg-blue-950 flex justify-between gap-4 px-6 py-4">
    <ActionButton @click="$emit('toggleIsEditing')" :text="`${isEditing ? 'Save' : 'Edit'}`" />
    <ActionButton
      @click="$emit('submitDelete')"
      bgColor="#FF5F57"
      hoverColor="#9C0203"
      text="Delete"
    />
  </div>
</template>
