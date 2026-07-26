<script setup lang="ts">
import WorkoutExerciseItem from './WorkoutExerciseItem.vue'
import type { MuscleGroup } from '../types'

defineProps<{
  group: MuscleGroup
  completed: Record<string, boolean>
}>()

defineEmits<{
  (e: 'toggle', id: string): void
}>()
</script>

<template>
  <section mb-6>
    <h2 text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide>{{ group.name }}</h2>
    <WorkoutExerciseItem
      v-for="exercise in group.exercises"
      :key="exercise.id"
      :exercise="exercise"
      :completed="!!completed[exercise.id]"
      @toggle="$emit('toggle', $event)"
    />
  </section>
</template>
