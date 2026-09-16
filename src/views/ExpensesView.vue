<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinance } from '../composables/useFinance'
import ExpenseList from '../components/ExpenseList.vue'
import ExpenseModal from '../components/ExpenseModal.vue'
import Spinner from '../components/Spinner.vue'
import { PiggyBank, ShoppingBasket, Plus } from 'lucide-vue-next'
import { useConfirmModal } from '../composables/useConfirmModal'

const { balance, dailyAmount, expenses, loading, clearAll } = useFinance()
const { confirmModal } = useConfirmModal()
const showAddModal = ref(false)

async function handleClearAll() {
  if (await confirmModal('Remover todos os gastos registrados?')) {
    clearAll()
  }
}

const formattedBalance = computed(() => {
  if (loading.value) return 'Carregando...'
  const prefix = balance.value >= 0 ? 'R$' : '-R$'
  return `${prefix}${Math.abs(balance.value).toFixed(2).replace('.', ',')}`
})

const dailyAmountFormatted = computed(() => {
  if (loading.value) return '...'
  return `R$${dailyAmount.toFixed(2).replace('.', ',')}`
})

const fabClass = computed(() => [
  balance.value >= 0 ? 'bg-green-600' : 'bg-red-500',
  loading.value ? 'opacity-0' : 'opacity-100'
])
</script>

<template>
  <div h-full overflow-y-auto class="no-scrollbar" text-left text-gray-900 font-sans>
    <div w-full md:max-w-4xl md:mx-auto px-4 md:px-8>
      <!-- Header / Balance -->
      <header pt-8 pb-3 flex="~ col" gap-4>
        <div>
          <div flex items-center justify-between mb-1>
            <div flex items-center gap-2>
              <PiggyBank text-gray-200 />
              <h1 text-sm tracking-wide text-gray-200 font-bold>Saldo Atual</h1>
            </div>
            <button v-if="expenses.length" @click="handleClearAll" text-sm text-gray-400 hover:text-white>
              Limpar tudo
            </button>
          </div>
          <div text-5xl font-semibold tracking-tighter mt-3 mb-1 text-gray-100>
            {{ formattedBalance }}
          </div>
          <span text-sm text-gray-400>Gasto médio diário: {{ dailyAmountFormatted }}</span>
        </div>
        <div flex items-center gap-2>
          <ShoppingBasket :size="20" text-gray-200 />
          <h1 text-sm tracking-wide text-gray-200 font-bold>Compras recentes</h1>
        </div>
      </header>

      <!-- Content -->
      <main pb-24>
        <div v-if="loading">
          <Spinner />
        </div>
        <ExpenseList v-else :expenses="expenses" />
      </main>
    </div>

    <!-- FAB -->
    <button
      @click="showAddModal = true"
      fixed right-6 w-14 h-14
      style="bottom: calc(var(--bottom-nav-h) + 1.5rem)"
      :class="fabClass"
      text-white rounded-full shadow-lg flex items-center justify-center
      text-2xl hover:scale-105 transition-all active:scale-95
      aria-label="Adicionar compra"
    >
      <Plus :size="22" />
    </button>

    <ExpenseModal v-model="showAddModal" />
  </div>
</template>
