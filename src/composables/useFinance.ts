import { ref, computed } from 'vue'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
  type DocumentData,
  Query
} from 'firebase/firestore'
import dayjs from 'dayjs'
import type { Expense, ExpenseInput } from '../types'
import { capitalize } from '../utils'

const expenses = ref<Expense[]>([])
const expensesRef = ref<Query<DocumentData, DocumentData> | null>(null)
const loading = ref(true)

// Singleton state
let initialized = false

export function useFinance() {
  if (!initialized) {
    init()
    initialized = true
  }

  const dailyAmount = 74

  const balance = computed(() => {
    const spent = expenses.value.reduce((acc, expense) => acc + expense.amount, 0)
    const today = dayjs().date()
    return dailyAmount * today - spent
  })

  async function addExpense(expense: ExpenseInput) {
    await addDoc(collection(db, 'expenses'), {
      ...expense,
      name: capitalize(expense.name),
      createdAt: serverTimestamp()
    })
  }

  async function clearAll() {
    const batch = writeBatch(db)
    expenses.value.forEach(expense => batch.delete(doc(db, 'expenses', expense.id)))
    await batch.commit()
  }

  return {
    expenses,
    balance,
    dailyAmount,
    loading,
    addExpense,
    clearAll
  }
}

function init() {
  // Listen to expenses
  expensesRef.value = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'))
  onSnapshot(expensesRef.value, (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Expense))
    loading.value = false
  })
}
