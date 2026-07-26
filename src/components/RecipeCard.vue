<script setup lang="ts">
import type { Recipe } from '../types'

const props = defineProps<{
  recipe: Recipe
}>()

defineEmits<{
  (e: 'select', recipe: Recipe): void
}>()
</script>

<template>
  <button
    @click="$emit('select', recipe)"
    w-40 flex-shrink-0 text-left rounded-3xl p-4 select-none
    bg="#3f4171" bg-opacity-50 shadow-sm flex="~ col" gap-1
  >
    <h3 font-semibold text-gray-200 text-sm overflow-hidden text-ellipsis whitespace-nowrap>
      {{ recipe.title }}
    </h3>
    <p v-if="recipe.calories || recipe.protein" text-xs text-gray-400>
      <span v-if="recipe.calories">{{ recipe.calories }}kcal</span>
      <span v-if="recipe.calories && recipe.protein"> · </span>
      <span v-if="recipe.protein">{{ recipe.protein }}g prot</span>
    </p>
  </button>
</template>
