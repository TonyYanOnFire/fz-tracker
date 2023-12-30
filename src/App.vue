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
    &, &.cover {
      z-index: 7 ;
    }
  }

  .p-body, .uix_headerContainer{
    z-index: 6;
  }

  .el-icon svg path {
    fill: currentColor;
  }
}
</style>
