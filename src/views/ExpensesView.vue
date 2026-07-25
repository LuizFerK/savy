<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinance } from '../composables/useFinance'
import ExpenseList from '../components/ExpenseList.vue'
import ExpenseModal from '../components/ExpenseModal.vue'
import Spinner from '../components/Spinner.vue'
import { PiggyBank, ShoppingBasket, Plus } from 'lucide-vue-next'

const { balance, dailyAmount, expenses, loading } = useFinance()
const showAddModal = ref(false)

const formattedBalance = computed(() => {
  if (loading.value) return 'Carregando...'
  const prefix = balance.value >= 0 ? 'R$' : '-R$'
  return `${prefix}${Math.abs(balance.value).toFixed(2).replace('.', ',')}`
})

const dailyAmountFormatted = computed(() => {
  if (loading.value) return '...'
  return `R$${dailyAmount.toFixed(2).replace('.', ',')}`
})
</script>

<template>
  <div class="background-accent" :class="{'green': balance >= 0, 'red': balance < 0, 'opacity-0': loading, 'opacity-100': !loading}"></div>
  <div class="background-accent secondary" :class="{'green': balance >= 0, 'red': balance < 0, 'opacity-0': loading, 'opacity-100': !loading}"></div>
  <div h-full text-left min-h-0 text-gray-900 font-sans>
    <div max-w-md mx-auto h-full flex flex-col relative>
      <!-- Header / Balance -->
      <header px-4 h="1/4" z-10 sticky top-0 pt-8 pb-3 flex="~ col" justify-between>
        <div>
          <div flex items-center gap-2 mb-1>
            <PiggyBank text-gray-200 />
            <h1 text-sm tracking-wide text-gray-200 font-bold>Saldo Atual</h1>
          </div>
          <div text-5xl font-semibold tracking-tighter mt-3 mb-1 text-gray-200>
            {{ formattedBalance }}
          </div>
          <span text-sm text-gray-200>Gasto médio diário: {{ dailyAmountFormatted }}</span>
        </div>
        <div flex items-center gap-2>
          <ShoppingBasket :size="20" text-gray-200 />
          <h1 text-sm tracking-wide text-gray-200 font-bold>Compras recentes</h1>
        </div>
      </header>

      <!-- Content -->
      <main h="3/4">
        <div v-if="loading">
          <Spinner />
        </div>
        <div v-else h-full overflow-y-auto class="no-scrollbar">
          <ExpenseList px-4 :expenses="expenses" />
        </div>
      </main>

      <!-- FAB -->
      <button
        @click="showAddModal = true"
        fixed right-6 w-14 h-14
        style="bottom: calc(var(--bottom-nav-h) + 1.5rem)"
        :class="{'green': balance >= 0, 'red': balance < 0, 'opacity-0': loading, 'opacity-100': !loading}"
        text-white rounded-full shadow-lg flex items-center justify-center
        text-2xl hover:scale-105 transition-all active:scale-95
        aria-label="Adicionar compra"
      >
        <Plus :size="22" color-gray-200 />
      </button>

      <ExpenseModal v-model="showAddModal" />
    </div>
  </div>
</template>
