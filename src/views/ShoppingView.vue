<script setup lang="ts">
import SimpleListView from '../components/SimpleListView.vue'
import { useShoppingList } from '../composables/useSimpleList'
</script>

<template>
  <SimpleListView
    :use-list="useShoppingList"
    title="Mercado"
    add-sheet-title="Novo item"
    add-placeholder="Ex: Leite"
    add-aria-label="Adicionar item"
    empty-text="Nenhum item cadastrado"
    remove-confirm-text="Remover este item?"
    clear-confirm-text="Remover todos os itens?"
  />
</template>
