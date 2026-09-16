<script setup lang="ts">
import type { Expense } from '../types'
import ExpenseCard from './ExpenseCard.vue'

const props = defineProps<{
  expenses: Expense[]
}>()
</script>

<template>
  <div grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4>
    <ExpenseCard
      v-for="expense in expenses"
      :key="expense.id"
      :expense="expense"
    />

    <div v-if="expenses.length === 0" text-center text-gray-500 py-10 class="md:col-span-2 xl:col-span-3">
      Nenhuma compra registrada
    </div>
  </div>
</template>
