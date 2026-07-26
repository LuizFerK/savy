import { Timestamp } from 'firebase/firestore'
import type { LucideIcon } from 'lucide-vue-next'

export type Category =
  | 'Mercado'
  | 'Restaurante'
  | 'Delivery'
  | 'Uber/99'
  | 'BlaBlaCar'
  | 'Ônibus'
  | 'Farmácia'
  | 'Cinema'
  | 'Ingresso'
  | 'Outros'

export interface Expense {
  id: string
  name: string
  category: Category
  amount: number
  createdAt: Timestamp
}

export interface ExpenseInput {
  name: string
  category: Category
  amount: number
}

export type CategoryIcon = {
  [key in Category]: {
    icon: LucideIcon
    color: string
  }
}

export type MealCategory =
  | 'Café da manhã'
  | 'Almoço'
  | 'Lanche da tarde'
  | 'Janta'
  | 'Refeição líquida'
  | 'Doces'

export interface Ingredient {
  quantity: string
  name: string
}

export interface Recipe {
  id: string
  title: string
  category: MealCategory
  ingredients: Ingredient[]
  steps: string[]
  calories?: number
  protein?: number
  createdAt: Timestamp
}

export type RecipeInput = Omit<Recipe, 'id' | 'createdAt'>

export type MealCategoryIcon = {
  [key in MealCategory]: {
    icon: LucideIcon
    color: string
  }
}

export interface ListItem {
  id: string
  title: string
  completed: boolean
  order: number
  createdAt: Timestamp
}

export type ListItemInput = Omit<ListItem, 'id' | 'createdAt'>