import { ref, computed } from 'vue'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  type DocumentData,
  Query
} from 'firebase/firestore'
import { capitalize, mealCategories } from '../utils'
import type { Recipe, RecipeInput, MealCategory } from '../types'

const recipes = ref<Recipe[]>([])
const recipesRef = ref<Query<DocumentData, DocumentData> | null>(null)
const loading = ref(true)

// Singleton state
let initialized = false

export function useRecipes() {
  if (!initialized) {
    init()
    initialized = true
  }

  const groupedRecipes = computed(() => {
    const groups = Object.fromEntries(
      mealCategories.map(category => [category, [] as Recipe[]])
    ) as Record<MealCategory, Recipe[]>

    for (const recipe of recipes.value) {
      groups[recipe.category]?.push(recipe)
    }

    return groups
  })

  async function addRecipe(recipe: RecipeInput) {
    await addDoc(collection(db, 'recipes'), {
      ...normalizeRecipe(recipe),
      createdAt: serverTimestamp()
    })
  }

  async function updateRecipe(id: string, recipe: RecipeInput) {
    await updateDoc(doc(db, 'recipes', id), { ...normalizeRecipe(recipe) })
  }

  return {
    recipes,
    groupedRecipes,
    loading,
    addRecipe,
    updateRecipe
  }
}

function normalizeRecipe(recipe: RecipeInput): RecipeInput {
  return {
    ...recipe,
    title: capitalize(recipe.title),
    ingredients: recipe.ingredients.map(ingredient => ({ ...ingredient, name: capitalize(ingredient.name) })),
    steps: recipe.steps.map(capitalize)
  }
}

function init() {
  // Listen to recipes
  recipesRef.value = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'))
  onSnapshot(recipesRef.value, (snapshot) => {
    recipes.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Recipe))
    loading.value = false
  })
}
