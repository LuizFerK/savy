<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import SimpleListItem from './SimpleListItem.vue'
import SimpleListAddSheet from './SimpleListAddSheet.vue'
import Spinner from './Spinner.vue'
import { Plus } from 'lucide-vue-next'
import type { ListItem } from '../types'

const props = defineProps<{
  useList: () => {
    items: import('vue').Ref<ListItem[]>
    loading: import('vue').Ref<boolean>
    addItem: (title: string) => Promise<void>
    removeItem: (id: string) => Promise<void>
    clearAll: () => Promise<void>
    toggleItem: (id: string) => void
    reorderItems: (orderedIds: string[]) => Promise<void>
  }
  title: string
  addSheetTitle: string
  addPlaceholder: string
  addAriaLabel: string
  emptyText: string
  removeConfirmText: string
  clearConfirmText: string
}>()

const { items, loading, addItem, removeItem, clearAll, toggleItem, reorderItems } = props.useList()

const showAdd = ref(false)
const listEl = ref<HTMLElement | null>(null)

function handleDragEnd() {
  reorderItems(items.value.map(item => item.id))
}

function handleRemove(id: string) {
  if (confirm(props.removeConfirmText)) {
    removeItem(id)
  }
}

function handleClearAll() {
  if (confirm(props.clearConfirmText)) {
    clearAll()
  }
}

// Manual FLIP animation: toggling completion reorders the list via a Firestore
// round-trip (not a vuedraggable drag), so it needs its own move animation.
// The reorder can land whenever Firestore's listener echoes it back, which may
// be well before or after `toggleItem`'s own promise resolves — so instead of
// awaiting that promise, we watch `items` itself and react the instant Vue
// actually patches the DOM (flush: 'post' guarantees this runs before the
// browser paints, so there's no flash of the already-reordered list first).
let pendingRects: Map<string, DOMRect> | null = null

function handleToggle(id: string) {
  if (listEl.value) {
    const rects = new Map<string, DOMRect>()
    listEl.value.querySelectorAll<HTMLElement>('[data-item-id]').forEach(el => {
      rects.set(el.dataset.itemId as string, el.getBoundingClientRect())
    })
    pendingRects = rects
  }
  toggleItem(id)
}

watch(items, () => {
  if (!pendingRects || !listEl.value) return
  const firstRects = pendingRects
  pendingRects = null

  listEl.value.querySelectorAll<HTMLElement>('[data-item-id]').forEach(el => {
    const itemId = el.dataset.itemId as string
    const first = firstRects.get(itemId)
    if (!first) return

    const last = el.getBoundingClientRect()
    const deltaY = first.top - last.top
    if (!deltaY) return

    // Web Animations API instead of a manual "set transform, then transition
    // back" dance: it doesn't depend on forcing a reflow between two style
    // writes across a requestAnimationFrame boundary, so it can't silently
    // lose the animation to a timing race the way that approach could.
    el.animate(
      [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0)' }],
      { duration: 400, easing: 'ease' }
    )
  })
}, { flush: 'post' })
</script>

<template>
  <div h-full flex="~ col" text-left>
    <header px-4 pt-8 pb-3 flex items-center justify-between>
      <h1 text-lg font-bold text-gray-200>{{ title }}</h1>
      <div flex items-center gap-4>
        <button v-if="items.length" @click="handleClearAll" text-sm text-gray-400 hover:text-white>
          Limpar tudo
        </button>
        <button
          @click="showAdd = true"
          w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white
          flex items-center justify-center transition-all active:scale-95
          :aria-label="addAriaLabel"
        >
          <Plus :size="20" />
        </button>
      </div>
    </header>

    <div v-if="loading">
      <Spinner />
    </div>
    <main v-else flex-1 overflow-y-auto class="no-scrollbar" px-4 pb-6>
      <div ref="listEl">
        <draggable
          v-model="items"
          item-key="id"
          handle=".drag-handle"
          :animation="150"
          :force-fallback="true"
          ghost-class="drag-ghost"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <SimpleListItem :item="element" @toggle="handleToggle" @remove="handleRemove" />
          </template>
        </draggable>
      </div>

      <div v-if="items.length === 0" text-center text-gray-500 py-10>
        {{ emptyText }}
      </div>
    </main>

    <SimpleListAddSheet v-model="showAdd" :heading="addSheetTitle" :placeholder="addPlaceholder" @add="addItem" />
  </div>
</template>

<style scoped>
:deep(.drag-ghost) {
  opacity: 0.4;
}
</style>
