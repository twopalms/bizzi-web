<script setup lang="ts">
import { useRoute } from 'vue-router'
import CardList from '../components/CardList.vue'

const route = useRoute()

function isRoot() {
  return route.path == '/cards'
}
</script>

<template>
  <CardList :class="`${isRoot() ? '' : 'hidden'} sm:block bg-gray-100`" />
  <router-view />
</template>
