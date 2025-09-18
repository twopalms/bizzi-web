<script setup lang="ts">
import BizziCard from '../components/BizziCard.vue'
import CardDetailHeader from '../components/CardDetailHeader.vue'
</script>

<template>
  <div class="sm:h-screen w-full overflow-y-auto">
    <CardDetailHeader />
    <div class="flex flex-1 flex-col items-center justify-center p-4">
      <BizziCard color="#4fd4d6" class="w-full" />
    </div>
  </div>
</template>
