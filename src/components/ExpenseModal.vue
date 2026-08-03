<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useFinance } from '../composables/useFinance'
import { ChevronLeft } from 'lucide-vue-next'
import type { Category } from '../types'
import { categories } from '../utils'
import { useConfirmModal } from '../composables/useConfirmModal'

const { alertModal } = useConfirmModal()

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { addExpense } = useFinance()

const currentStep = ref(1)
const name = ref('')
const category = ref<Category | ''>('')
const amount = ref(0)
const loading = ref(false)

const formattedAmount = computed(() => {
  return amount.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
})

function handleAmountInput(e: Event) {
  const input = e.target as HTMLInputElement
  const value = input.value
  const digits = value.replace(/\D/g, '')
  amount.value = Number(digits) / 100
  
  // Force update input value to matches formatted state
  // This fixes cases where value doesn't change (0 -> 0)
  // or when invalid chars are typed
  input.value = amount.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const amountInput = ref<HTMLInputElement | null>(null)
const nameInput = ref<HTMLInputElement | null>(null)

function selectCategory(cat: Category) {
  category.value = cat
}

async function nextStep() {
  if (currentStep.value === 1 && category.value) {
    currentStep.value = 2
    await nextTick()
    amountInput.value?.focus()
  } else if (currentStep.value === 2 && amount.value > 0) {
    currentStep.value = 3
    await nextTick()
    nameInput.value?.focus()
  }
}

async function handleSave() {
  if (!name.value || !amount.value || !category.value) return
  
  loading.value = true
  try {
    await addExpense({
      name: name.value,
      category: category.value,
      amount: amount.value
    })
    close()
  } catch (e) {
    console.error(e)
    await alertModal('Erro ao salvar')
  } finally {
    loading.value = false
  }
}

function close() {
  currentStep.value = 1
  name.value = ''
  category.value = ''
  amount.value = 0
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
              @click="currentStep--" 
              text-gray-400 hover:text-white transition-colors
            >
              <ChevronLeft :size="24" />
            </button>
            <h2 text-xl font-bold text-gray-200>
              {{ currentStep === 1 ? 'Categoria' : currentStep === 2 ? 'Valor' : 'Nome' }}
            </h2>
          </div>
          <button @click="close" text-sm text-gray-400 hover:text-white>Cancelar</button>
        </div>
      
        <div flex-1 overflow-y-auto class="step-content">
          <!-- Step 1: Categories -->
          <div v-if="currentStep === 1" grid grid-cols-3 gap-3>
            <button
              v-for="[cat, { icon, color }] in Object.entries(categories)"
              :key="cat"
              @click="selectCategory(cat as Category)"
              flex flex-col items-center justify-center aspect-square rounded-xl border-2 transition-all p-2
              :style="{
                background: category === cat ? color : '#ffffff10',
                color: category === cat ? '#343466' : '#e5e7eb'
              }"
            >
              <component :is="icon" :color="cat === category ? '#343466' : color" transition-colors :size="32" mb-2 />
              <span text-xs font-medium text-center>{{ cat }}</span>
            </button>
          </div>

          <!-- Step 2: Amount -->
          <div v-if="currentStep === 2" flex flex-col h-full>
            <label text-gray-400 text-sm mb-2>Quanto foi?</label>
            <div relative w-full>
              <span absolute left-0 top="1/2" translate-y="-1/2" text-2xl text-gray-400 font-medium>R$</span>
              <input
                ref="amountInput"
                type="tel"
                inputmode="numeric"
                autocomplete="off"
                :value="formattedAmount"
                @input="handleAmountInput"
                w-full pl-10 bg-transparent border-b-2 border="white/20" text-4xl font-bold text-white text-center focus:outline-none placeholder-gray-600
                placeholder="0,00"
                autofocus
                @keydown.enter="nextStep"
              />
            </div>
          </div>

          <!-- Step 3: Name -->
          <div v-if="currentStep === 3" flex flex-col h-full>
            <label text-gray-400 text-sm mb-2>Nome da compra</label>
            <input 
              ref="nameInput"
              v-model="name"
              type="text"
              autocomplete="off"
              w-full bg-transparent border-b-2 border="white/20" py-3 text-xl text-white placeholder-gray-500 outline-none transition-colors
              placeholder="Ex: Almoço de domingo"
              autofocus
              @keydown.enter="handleSave"
            />
          </div>
        </div>

        <!-- Footer Actions -->
        <div mt-6>
          <button 
            v-if="currentStep < 3"
            @click="nextStep"
            w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
            :disabled="(currentStep === 1 && !category) || (currentStep === 2 && !amount)"
          >
            Próximo
          </button>
          <button 
            v-else
            @click="handleSave"
            w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all
            :disabled="loading || !name"
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
