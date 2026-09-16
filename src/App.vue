<script setup lang="ts">
import SidebarNav from './components/SidebarNav.vue'
import BottomNav from './components/BottomNav.vue'
import ConfirmModal from './components/ConfirmModal.vue'
</script>

<template>
  <div h-screen w-full overflow-hidden flex relative bg-zinc-950>
    <SidebarNav hidden md:flex />

    <div flex-1 h-full overflow-hidden relative>
      <div class="router-view-wrapper" w-full max-w-md mx-auto md:max-w-none>
        <router-view />
      </div>
    </div>

    <BottomNav md:hidden />
    <ConfirmModal />
  </div>
</template>

<style scoped>
.router-view-wrapper {
  height: calc(100vh - var(--bottom-nav-h));
}
</style>
