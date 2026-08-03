<script setup lang="ts">
import { computed } from 'vue'
import type { Expense } from '../types'
import dayjs from 'dayjs'
import { capitalize, categories } from '../utils'

const props = defineProps<{
  expense: Expense
}>()

const formatDate = (date: any) => {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : date
  return dayjs(d).format('DD/MM HH:mm')
}

const category = computed(() => categories[props.expense.category])
</script>

<template>
  <div relative rounded-xl mb-4 select-none touch-pan-y>
    <div 
      relative bg="#3f4171" bg-opacity-50 p-4 rounded-3xl shadow-sm flex
      justify-between items-center transition-transform will-change-transform
    >
      <div mr-4 w-13 h-10 rounded-xl bg="#343466" grid place-items-center>
        <component :is="category.icon" :size="20" :color="category.color" />
      </div>
      <div text-left w="2/3">
        <h3 font-semibold text-gray-200 overflow-hidden text-ellipsis whitespace-nowrap>{{ capitalize(expense.name) }}</h3>
        <p text-xs text-gray-400>{{ expense.category }} • {{ formatDate(expense.createdAt) }}</p>
      </div>
      <div w-32 text="#f98fa5" font-bold font-mono text-right>
        -R${{ expense.amount.toFixed(2).replace('.', ',') }}
      </div>
    </div>
  </div>
</template>

