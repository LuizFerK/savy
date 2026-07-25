<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>

<template>
  <div h-screen w-full overflow-hidden max-w-md mx-auto relative>
    <div class="router-view-wrapper">
      <router-view />
    </div>
    <BottomNav />
  </div>
</template>

<style scoped>
.router-view-wrapper {
  height: calc(100vh - var(--bottom-nav-h));
}
</style>
