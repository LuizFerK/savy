import { ref } from 'vue'
import { db } from '../firebase'
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
  query,
  orderBy,
  type DocumentData,
  Query
} from 'firebase/firestore'
import type { ListItem } from '../types'
import { capitalize } from '../utils'

// Shared behavior behind Tarefas/Mercado: a checkable, reorderable, Firestore-backed
// list. Each collection gets its own singleton store (mirrors useFinance/useRecipes'
// module-level singleton pattern, just parameterized by collection name).
export function createSimpleListStore(collectionName: string) {
  const items = ref<ListItem[]>([])
  const itemsRef = ref<Query<DocumentData, DocumentData> | null>(null)
  const loading = ref(true)

  let initialized = false

  function useList() {
    if (!initialized) {
      init()
      initialized = true
    }

    async function addItem(title: string) {
      // Snapshot before the write — onSnapshot can update items.value while addDoc is in flight
      const before = [...items.value]

      const newDoc = await addDoc(collection(db, collectionName), {
        title: capitalize(title),
        completed: false,
        order: 0,
        createdAt: serverTimestamp()
      })

      // New items land at the top of the list
      const list = [{ id: newDoc.id, completed: false } as ListItem, ...before]

      await persistOrder(list)
    }

    async function removeItem(id: string) {
      await deleteDoc(doc(db, collectionName, id))
    }

    async function clearAll() {
      const batch = writeBatch(db)
      items.value.forEach(item => batch.delete(doc(db, collectionName, item.id)))
      await batch.commit()
    }

    function toggleItem(id: string) {
      const list = [...items.value]
      const index = list.findIndex(item => item.id === id)
      const current = list[index]
      if (!current) return

      const target = { ...current, completed: !current.completed }
      list.splice(index, 1)

      const boundary = list.findIndex(item => item.completed)
      list.splice(boundary === -1 ? list.length : boundary, 0, target)

      const reordered = list.map((item, order) => ({ ...item, order }))

      // Apply the reorder locally right away — the move animation depends on this
      // happening synchronously, not after Firestore's round-trip confirms it.
      items.value = reordered
      persistOrder(reordered).catch(console.error)
    }

    async function reorderItems(orderedIds: string[]) {
      const list = orderedIds
        .map(id => items.value.find(item => item.id === id))
        .filter((item): item is ListItem => !!item)

      await persistOrder(list)
    }

    return {
      items,
      loading,
      addItem,
      removeItem,
      clearAll,
      toggleItem,
      reorderItems
    }
  }

  async function persistOrder(list: ListItem[]) {
    const batch = writeBatch(db)
    list.forEach((item, index) => {
      batch.update(doc(db, collectionName, item.id), { order: index, completed: item.completed })
    })
    await batch.commit()
  }

  function init() {
    itemsRef.value = query(collection(db, collectionName), orderBy('order', 'asc'))
    onSnapshot(itemsRef.value, (snapshot) => {
      items.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ListItem))
      loading.value = false
    })
  }

  return useList
}

export const useTodos = createSimpleListStore('todos')
export const useShoppingList = createSimpleListStore('shopping')
