import { ListChecks, ShoppingCart, BookOpen, Dumbbell, PiggyBank } from 'lucide-vue-next'
import type { LucideIcon } from 'lucide-vue-next'

export interface NavItem {
  name: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { name: 'todo', label: 'Tarefas', icon: ListChecks },
  { name: 'shopping', label: 'Mercado', icon: ShoppingCart },
  { name: 'recipes', label: 'Receitas', icon: BookOpen },
  { name: 'workouts', label: 'Treinos', icon: Dumbbell },
  { name: 'expenses', label: 'Gastos', icon: PiggyBank }
]
