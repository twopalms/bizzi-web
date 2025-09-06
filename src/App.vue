<script setup lang="ts"></script>

<template>
  <div class="flex font-custom h-screen">
    <router-view name="LeftSidebar" class="order-1" />
    <router-view class="w-full order-2" />
  </div>
</template>

<style scoped></style>
