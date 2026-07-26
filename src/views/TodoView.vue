<script setup lang="ts">
import SimpleListView from '../components/SimpleListView.vue'
import { useTodos } from '../composables/useSimpleList'
</script>

<template>
  <SimpleListView
    :use-list="useTodos"
    title="Tarefas"
    add-sheet-title="Nova tarefa"
    add-placeholder="Ex: Lavar a louça"
    add-aria-label="Adicionar tarefa"
    empty-text="Nenhuma tarefa cadastrada"
    remove-confirm-text="Remover esta tarefa?"
    clear-confirm-text="Remover todas as tarefas?"
  />
</template>
