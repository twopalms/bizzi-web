<script setup lang="ts">
const isPublic = defineModel<boolean>(false)
</script>

<template>
  <div class="flex flex-col gap-4">
    <label class="font-medium">Visibility</label>
    <fieldset class="flex gap-4 hover:cursor-pointer">
      <div class="flex gap-2">
        <input
          :value="false"
          v-model="isPublic"
          type="radio"
          id="private"
          name="drone"
          class="hover:cursor-pointer"
        />
        <label for="private" class="hover:cursor-pointer">Private</label>
      </div>

      <div class="flex gap-2 hover:cursor-pointer">
        <input
          :value="true"
          v-model="isPublic"
          type="radio"
          id="public"
          name="drone"
          class="hover:cursor-pointer"
        />
        <label for="public" class="hover:cursor-pointer">Public</label>
      </div>
    </fieldset>
  </div>
</template>
