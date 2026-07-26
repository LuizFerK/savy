import * as Lucide from 'lucide-vue-next'
import type { CategoryIcon, MealCategory, MealCategoryIcon } from './types'

export const categories: CategoryIcon = {
  Mercado: { icon: Lucide.ShoppingCart, color: '#A3DC9A' },
  Restaurante: { icon: Lucide.Utensils, color: '#CD5656' },
  Delivery: { icon: Lucide.HamburgerIcon, color: '#B77466' },
  'Uber/99': { icon: Lucide.CarTaxiFront, color: '#FD7979' },
  BlaBlaCar: { icon: Lucide.Luggage, color: '#BBDCE5' },
  Ônibus: { icon: Lucide.BusFront, color: '#BBDCE5' },
  Farmácia: { icon: Lucide.HeartPlus, color: '#8CA9FF' },
  Cinema: { icon: Lucide.Clapperboard, color: '#DEE791' },
  Ingresso: { icon: Lucide.Ticket, color: '#7F55B1' },
  Outros: { icon: Lucide.Box, color: '#f98fa5' },
}

export const mealCategories: MealCategory[] = [
  'Café da manhã',
  'Almoço',
  'Lanche da tarde',
  'Janta',
  'Refeição líquida',
  'Doces'
]

export const mealCategoryIcons: MealCategoryIcon = {
  'Café da manhã': { icon: Lucide.Coffee, color: '#F6C177' },
  'Almoço': { icon: Lucide.UtensilsCrossed, color: '#A3DC9A' },
  'Lanche da tarde': { icon: Lucide.Cookie, color: '#DEE791' },
  'Janta': { icon: Lucide.Moon, color: '#8CA9FF' },
  'Refeição líquida': { icon: Lucide.GlassWater, color: '#BBDCE5' },
  'Doces': { icon: Lucide.Candy, color: '#f98fa5' },
}
