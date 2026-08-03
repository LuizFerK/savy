<script setup lang="ts">
import type { Recipe } from '../types'
import { capitalize, mealCategoryIcons } from '../utils'

const props = defineProps<{
  modelValue: boolean
  recipe: Recipe | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit'): void
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue && recipe" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 backdrop-blur-sm @click.self="close">
      <div w-full h="5/6" bg="#343466" rounded-t-2xl sm:rounded-2xl p-6 shadow-xl class="modal-card flex flex-col">

        <!-- Header -->
        <div flex items-center justify-between mb-6>
          <div flex items-center gap-2>
            <component :is="mealCategoryIcons[recipe.category].icon" :size="20" :color="mealCategoryIcons[recipe.category].color" />
            <h2 text-sm tracking-wide text-gray-400>{{ recipe.category }}</h2>
          </div>
          <button @click="emit('edit')" text-sm text-gray-400 hover:text-white>Editar</button>
        </div>

        <div flex-1 overflow-y-auto class="no-scrollbar">
          <h1 text-2xl font-bold text-gray-200 mb-1>{{ capitalize(recipe.title) }}</h1>

          <p v-if="recipe.calories || recipe.protein" text-sm text-gray-400 mb-6>
            <span v-if="recipe.calories">{{ recipe.calories }}kcal</span>
            <span v-if="recipe.calories && recipe.protein"> · </span>
            <span v-if="recipe.protein">{{ recipe.protein }}g de proteína</span>
          </p>

          <div mb-6>
            <h3 text-sm font-bold text-gray-200 mb-2>Ingredientes</h3>
            <ul space-y-1>
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index" text-sm text-gray-300>
                <span text-gray-400>{{ ingredient.quantity }}</span> {{ capitalize(ingredient.name) }}
              </li>
            </ul>
          </div>

          <div>
            <h3 text-sm font-bold text-gray-200 mb-2>Modo de preparo</h3>
            <ol space-y-2>
              <li v-for="(step, index) in recipe.steps" :key="index" text-sm text-gray-300>
                {{ index + 1 }}. {{ capitalize(step) }}
              </li>
            </ol>
          </div>
        </div>

        <!-- Footer Actions -->
        <div mt-6>
          <button
            @click="close"
            w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all
          >
            Fechar
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
