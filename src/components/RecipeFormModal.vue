<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRecipes } from '../composables/useRecipes'
import { ChevronLeft, Trash2 } from 'lucide-vue-next'
import type { Ingredient, MealCategory, Recipe, RecipeInput } from '../types'
import { mealCategoryIcons, mealCategories } from '../utils'
import { useConfirmModal } from '../composables/useConfirmModal'

const { alertModal } = useConfirmModal()

const props = defineProps<{
  modelValue: boolean
  recipe?: Recipe | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { addRecipe, updateRecipe } = useRecipes()

const stepTitles = ['Categoria', 'Informações', 'Ingredientes', 'Modo de preparo']
const totalSteps = stepTitles.length
const currentStep = ref(1)
const stepTitle = computed(() => stepTitles[currentStep.value - 1])

const title = ref('')
const category = ref<MealCategory | ''>('')
const ingredients = ref<Ingredient[]>([{ quantity: '', name: '' }])
const steps = ref<string[]>([''])
const calories = ref<number | undefined>(undefined)
const protein = ref<number | undefined>(undefined)
const loading = ref(false)

watch([() => props.modelValue, () => props.recipe], ([open]) => {
  if (!open) return

  currentStep.value = 1

  if (props.recipe) {
    title.value = props.recipe.title
    category.value = props.recipe.category
    ingredients.value = props.recipe.ingredients.map(ingredient => ({ ...ingredient }))
    steps.value = [...props.recipe.steps]
    calories.value = props.recipe.calories
    protein.value = props.recipe.protein
  } else {
    title.value = ''
    category.value = ''
    ingredients.value = [{ quantity: '', name: '' }]
    steps.value = ['']
    calories.value = undefined
    protein.value = undefined
  }
}, { immediate: true })

function nextStep() {
  if (currentStep.value < totalSteps) currentStep.value++
}

function backStep() {
  if (currentStep.value > 1) currentStep.value--
}

function addIngredientRow() {
  ingredients.value.push({ quantity: '', name: '' })
}

function removeIngredientRow(index: number) {
  ingredients.value.splice(index, 1)
}

function addStepRow() {
  steps.value.push('')
}

function removeStepRow(index: number) {
  steps.value.splice(index, 1)
}

async function handleSave() {
  if (!title.value || !category.value) return

  loading.value = true
  try {
    const payload: RecipeInput = {
      title: title.value,
      category: category.value,
      ingredients: ingredients.value.filter(ingredient => ingredient.name.trim()),
      steps: steps.value.map(step => step.trim()).filter(step => step),
      ...(calories.value ? { calories: calories.value } : {}),
      ...(protein.value ? { protein: protein.value } : {})
    }

    if (props.recipe) {
      await updateRecipe(props.recipe.id, payload)
    } else {
      await addRecipe(payload)
    }
    close()
  } catch (e) {
    console.error(e)
    await alertModal('Erro ao salvar')
  } finally {
    loading.value = false
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Transition name="modal">
    <div v-if="modelValue" fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black-50 backdrop-blur-sm @click.self="close">
      <div w-full h="5/6" bg="#343466" rounded-t-2xl sm:rounded-2xl p-6 shadow-xl class="modal-card flex flex-col">

        <!-- Header -->
        <div flex items-center justify-between mb-6>
          <div flex items-center gap-2>
            <button
              v-if="currentStep > 1"
              @click="backStep"
              text-gray-400 hover:text-white transition-colors
            >
              <ChevronLeft :size="24" />
            </button>
            <h2 text-xl font-bold text-gray-200>{{ stepTitle }}</h2>
          </div>
          <button @click="close" text-sm text-gray-400 hover:text-white>Cancelar</button>
        </div>

        <div flex-1 overflow-y-auto class="no-scrollbar">
          <!-- Step 1: Category -->
          <div v-if="currentStep === 1" grid grid-cols-3 gap-3>
            <button
              v-for="cat in mealCategories"
              :key="cat"
              @click="category = cat"
              flex flex-col items-center justify-center aspect-square rounded-xl border-2 transition-all p-2
              :style="{
                background: category === cat ? mealCategoryIcons[cat].color : '#ffffff10',
                color: category === cat ? '#343466' : '#e5e7eb'
              }"
            >
              <component :is="mealCategoryIcons[cat].icon" :color="cat === category ? '#343466' : mealCategoryIcons[cat].color" transition-colors :size="32" mb-2 />
              <span text-xs font-medium text-center>{{ cat }}</span>
            </button>
          </div>

          <!-- Step 2: Basic info -->
          <div v-if="currentStep === 2">
            <label text-gray-400 text-sm mb-2 block>Nome do prato</label>
            <input
              v-model="title"
              type="text"
              autocomplete="off"
              w-full bg-transparent border-b-2 border="white/20" py-3 mb-6 text-lg text-white placeholder-gray-500 outline-none transition-colors
              placeholder="Ex: Omelete de queijo"
              autofocus
            />

            <div flex gap-4>
              <div flex-1>
                <label text-gray-400 text-sm mb-2 block>Calorias (kcal)</label>
                <input
                  v-model.number="calories"
                  type="number"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Opcional"
                  w-full bg-transparent border-b-2 border="white/20" py-2 text-sm text-white placeholder-gray-500 outline-none
                />
              </div>
              <div flex-1>
                <label text-gray-400 text-sm mb-2 block>Proteínas (g)</label>
                <input
                  v-model.number="protein"
                  type="number"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="Opcional"
                  w-full bg-transparent border-b-2 border="white/20" py-2 text-sm text-white placeholder-gray-500 outline-none
                />
              </div>
            </div>
          </div>

          <!-- Step 3: Ingredients -->
          <div v-if="currentStep === 3">
            <div flex items-center justify-between mb-2>
              <label text-gray-400 text-sm>Ingredientes</label>
              <button @click="addIngredientRow" text-sm text-green-500 font-medium>+ Adicionar</button>
            </div>
            <div v-for="(ingredient, index) in ingredients" :key="index" flex gap-2 mb-2>
              <input
                v-model="ingredient.quantity"
                type="text"
                autocomplete="off"
                placeholder="Qtd."
                w="1/4" bg-transparent border-b-2 border="white/20" py-2 text-sm text-white placeholder-gray-500 outline-none
              />
              <input
                v-model="ingredient.name"
                type="text"
                autocomplete="off"
                placeholder="Ingrediente"
                flex-1 bg-transparent border-b-2 border="white/20" py-2 text-sm text-white placeholder-gray-500 outline-none
              />
              <button @click="removeIngredientRow(index)" text-gray-500 hover:text-white>
                <Trash2 :size="18" />
              </button>
            </div>
          </div>

          <!-- Step 4: Steps -->
          <div v-if="currentStep === 4">
            <div flex items-center justify-between mb-2>
              <label text-gray-400 text-sm>Modo de preparo</label>
              <button @click="addStepRow" text-sm text-green-500 font-medium>+ Adicionar</button>
            </div>
            <div v-for="(_, index) in steps" :key="index" flex gap-2 mb-2 items-center>
              <span text-gray-500 text-sm>{{ index + 1 }}.</span>
              <input
                v-model="steps[index]"
                type="text"
                autocomplete="off"
                placeholder="Descreva a etapa"
                flex-1 bg-transparent border-b-2 border="white/20" py-2 text-sm text-white placeholder-gray-500 outline-none
              />
              <button @click="removeStepRow(index)" text-gray-500 hover:text-white>
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div mt-6>
          <button
            v-if="currentStep < totalSteps"
            @click="nextStep"
            w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
            :disabled="(currentStep === 1 && !category) || (currentStep === 2 && !title)"
          >
            Próximo
          </button>
          <button
            v-else
            @click="handleSave"
            w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
            :disabled="loading || !title || !category"
          >
            {{ loading ? 'Salvando...' : 'Salvar' }}
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
