<script setup>
import VersionTracker from './components/VersionTracker.vue'

const titleElement = inject('titleElement')
</script>

<template>
  <teleport :to="titleElement">
    <VersionTracker />
  </teleport>
</template>

<style lang="scss">
.fz-tracker {
  .p-body-header {
    z-index: 5;
  }
  .p-body {
    z-index: 4;
  }

  .el-icon svg path {
    fill: currentColor;
  }
}
</style>
