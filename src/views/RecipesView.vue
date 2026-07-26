<script setup lang="ts">
import { ref, onMounted, nextTick, type ComponentPublicInstance } from 'vue'
import dayjs from 'dayjs'
import { useRecipes } from '../composables/useRecipes'
import RecipeSection from '../components/RecipeSection.vue'
import RecipeDetailModal from '../components/RecipeDetailModal.vue'
import RecipeFormModal from '../components/RecipeFormModal.vue'
import { Plus } from 'lucide-vue-next'
import { mealCategories } from '../utils'
import type { MealCategory, Recipe } from '../types'

const { groupedRecipes } = useRecipes()

const sectionRefs: Record<string, HTMLElement | null> = {}

function setSectionRef(category: MealCategory) {
  return (el: Element | ComponentPublicInstance | null) => {
    sectionRefs[category] = el as HTMLElement | null
  }
}

function currentMealCategory(): MealCategory {
  const hour = dayjs().hour()
  if (hour >= 5 && hour < 11) return 'Café da manhã'
  if (hour >= 11 && hour < 14) return 'Almoço'
  if (hour >= 14 && hour < 18) return 'Lanche da tarde'
  return 'Janta'
}

onMounted(async () => {
  await nextTick()
  sectionRefs[currentMealCategory()]?.scrollIntoView({ block: 'start' })
})

const showForm = ref(false)
const showDetail = ref(false)
const selectedRecipe = ref<Recipe | null>(null)
const editingRecipe = ref<Recipe | null>(null)

function openAdd() {
  editingRecipe.value = null
  showForm.value = true
}

function openDetail(recipe: Recipe) {
  selectedRecipe.value = recipe
  showDetail.value = true
}

function openEditFromDetail() {
  showDetail.value = false
  editingRecipe.value = selectedRecipe.value
  showForm.value = true
}
</script>

<template>
  <div h-full flex="~ col" text-left>
    <header px-4 pt-8 pb-3 flex items-center justify-between>
      <h1 text-lg font-bold text-gray-200>Livro de Receitas</h1>
      <button
        @click="openAdd"
        w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white
        flex items-center justify-center transition-all active:scale-95
        aria-label="Adicionar prato"
      >
        <Plus :size="20" />
      </button>
    </header>

    <main flex-1 overflow-y-auto class="no-scrollbar" px-4 space-y-6 pb-6>
      <div v-for="category in mealCategories" :key="category" :ref="setSectionRef(category)">
        <RecipeSection
          :category="category"
          :recipes="groupedRecipes[category]"
          @select="openDetail"
        />
      </div>
    </main>

    <RecipeDetailModal v-model="showDetail" :recipe="selectedRecipe" @edit="openEditFromDetail" />
    <RecipeFormModal v-model="showForm" :recipe="editingRecipe" />
  </div>
</template>
