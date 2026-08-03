<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  exerciseName: string
  initialValue: number | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', weight: number): void
}>()

const weight = ref<number | undefined>(undefined)
const weightInput = ref<HTMLInputElement | null>(null)

watch(() => props.modelValue, async (open) => {
  if (!open) return
  weight.value = props.initialValue
  await nextTick()
  weightInput.value?.focus()
})

function handleSave() {
  if (!weight.value || weight.value <= 0) return
  emit('save', Math.round(weight.value))
  close()
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 backdrop-blur-sm @click.self="close">
      <div w-full bg="#343466" rounded-t-2xl sm:rounded-2xl p-6 shadow-xl class="modal-card">

        <!-- Header -->
        <div flex items-center justify-between mb-6>
          <h2 text-xl font-bold text-gray-200>{{ exerciseName }}</h2>
          <button @click="close" text-sm text-gray-400 hover:text-white>Cancelar</button>
        </div>

        <label text-gray-400 text-sm mb-2 block>Peso (kg)</label>
        <input
          ref="weightInput"
          v-model.number="weight"
          type="number"
          inputmode="numeric"
          autocomplete="off"
          w-full bg-transparent border-b-2 border="white/20" py-3 mb-6 text-lg text-white placeholder-gray-500 outline-none transition-colors
          placeholder="Ex: 20"
          @keydown.enter="handleSave"
        />

        <button
          @click="handleSave"
          w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
          :disabled="!weight || weight <= 0"
        >
          Salvar
        </button>

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
