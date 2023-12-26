<script setup>
import VersionTracker from './components/VersionTracker.vue'

const titleElement = inject('titleElement')
</script>

<template>
  <teleport :to="titleElement">
    <VersionTracker />
  </teleport>
</template>
