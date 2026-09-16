<script setup lang="ts">
import { useConfirmModal } from '../composables/useConfirmModal'

const { state, selectButton, dismiss } = useConfirmModal()

const variantClass: Record<string, string> = {
  primary: 'bg-green-600 hover:bg-green-700 text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-gray-200',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="state.visible"
      fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 backdrop-blur-sm
      @click.self="dismiss"
    >
      <div w-full bg-zinc-900 rounded-t-2xl sm:rounded-2xl p-6 shadow-xl class="modal-card sm:w-1/2 sm:max-w-lg">
        <p text-gray-200 text-base mb-6>{{ state.message }}</p>

        <div flex gap-3 :class="state.buttons.length > 2 ? 'flex-col' : 'flex-row'">
          <button
            v-for="button in state.buttons"
            :key="button.label"
            @click="selectButton(button.value)"
            flex-1 py-3.5 rounded-xl font-bold text-lg transition-all
            :class="variantClass[button.variant]"
          >
            {{ button.label }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(100%);
}
</style>
