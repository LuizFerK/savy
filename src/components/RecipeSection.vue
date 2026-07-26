<script setup lang="ts">
import type { Recipe, MealCategory } from '../types'
import { mealCategoryIcons } from '../utils'
import RecipeCard from './RecipeCard.vue'

const props = defineProps<{
  category: MealCategory
  recipes: Recipe[]
}>()

defineEmits<{
  (e: 'select', recipe: Recipe): void
}>()

const icon = mealCategoryIcons[props.category].icon
</script>

<template>
  <div>
    <div flex items-center gap-2 mb-3>
      <component :is="icon" :size="18" text-gray-200 />
      <h2 text-sm tracking-wide text-gray-200 font-bold>{{ category }}</h2>
    </div>

    <div v-if="recipes.length" flex gap-3 overflow-x-auto class="no-scrollbar" pb-1>
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @select="$emit('select', recipe)"
      />
    </div>
    <div v-else text-sm text-gray-500 py-2>
      Nenhum prato cadastrado ainda
    </div>
  </div>
</template>
