<script setup lang="ts">
import { Check, Trash2, GripVertical } from 'lucide-vue-next'
import type { ListItem } from '../types'
import { capitalize } from '../utils'

defineProps<{
  item: ListItem
}>()

defineEmits<{
  (e: 'toggle', id: string): void
  (e: 'remove', id: string): void
}>()
</script>

<template>
  <div
    :data-item-id="item.id"
    flex items-center gap-3 rounded-2xl p-3 mb-3
    bg="#3f4171" bg-opacity-50
  >
    <button
      @click="$emit('toggle', item.id)"
      w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
      :style="{
        borderColor: item.completed ? '#22c55e' : '#ffffff40',
        background: item.completed ? '#22c55e' : 'transparent'
      }"
      aria-label="Concluir item"
    >
      <Check v-if="item.completed" :size="14" color="white" />
    </button>

    <span
      flex-1 text-sm break-words
      :class="item.completed ? 'text-gray-500 line-through' : 'text-gray-200'"
    >
      {{ capitalize(item.title) }}
    </span>

    <button @click="$emit('remove', item.id)" text-gray-500 hover:text-white flex-shrink-0 aria-label="Remover item">
      <Trash2 :size="18" />
    </button>

    <span class="drag-handle" text-gray-500 flex-shrink-0 select-none cursor-grab active:cursor-grabbing>
      <GripVertical :size="18" />
    </span>
  </div>
</template>
