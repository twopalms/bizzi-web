<script setup lang="ts">
import CardEditSection from '../components/CardEditSection.vue'

const card = defineModel<string | null>()

// import { useCardManager } from '../composables/useCardManager.ts'
// const { activeCard } = useCardManager()

// defineProps({
//   card: Object,
// })
</script>

<template>
  <div
    class="flex flex-1 flex-col bg-white border-1 border-gray-300 rounded-lg shadow-lg shadow-black/40 p-2"
  >
    <!-- <CardEditSection title="Profile Picture"> -->
    <!--   <label>Profile Picture</label> -->
    <!--   <ActionButton bgColor="#d1d1d1" hoverColor="#e1e1e1" class="h-20 border-gray-500 border"> -->
    <!--     <input type="file" accept="image/*" class="hover:cursor-pointer" /> -->
    <!--   </ActionButton> -->
    <!-- </CardEditSection> -->
    <CardEditSection title="Basic Information">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-medium">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            class="flex flex-grow bg-gray-100 rounded p-2 shadow-sm"
            v-model="card.name"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">Job Title</label>
          <input
            type="text"
            placeholder="Consultant, Designer, Software Engineer, etc."
            class="flex flex-grow bg-gray-100 rounded p-2 shadow-sm"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">Company</label>
          <input
            type="text"
            placeholder="Acme Industries"
            class="flex flex-grow bg-gray-100 rounded p-2 shadow-sm"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-medium">Location</label>
          <input
            type="text"
            placeholder="City, State or County"
            class="flex flex-grow bg-gray-100 rounded p-2 shadow-sm"
          />
        </div>
      </div>
    </CardEditSection>
    <CardEditSection title="Contact Information" />
    <CardEditSection title="Card Options" />
  </div>
</template>
