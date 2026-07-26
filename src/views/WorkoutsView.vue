<script setup lang="ts">
import { ref, computed } from 'vue'
import WorkoutDaySwitch from '../components/WorkoutDaySwitch.vue'
import WorkoutGroup from '../components/WorkoutGroup.vue'
import Spinner from '../components/Spinner.vue'
import { useWorkoutProgress } from '../composables/useWorkoutProgress'
import { workoutDays } from '../data/workouts'
import type { WorkoutDayId } from '../types'

const { completed, loading, toggleExercise, resetExercises } = useWorkoutProgress()

const selectedDay = ref<WorkoutDayId>('a')
const days = workoutDays.map(day => ({ id: day.id, label: day.label }))
const currentDay = computed(() => workoutDays.find(day => day.id === selectedDay.value)!)
const currentExerciseIds = computed(() =>
  currentDay.value.groups.flatMap(group => group.exercises.map(exercise => exercise.id))
)

function handleResetDay() {
  if (confirm('Desmarcar todos os exercícios deste dia?')) {
    resetExercises(currentExerciseIds.value)
  }
}
</script>

<template>
  <div h-full flex="~ col" text-left>
    <header px-4 pt-8 pb-3>
      <div flex items-center justify-between mb-4>
        <h1 text-lg font-bold text-gray-200>Treinos</h1>
        <button @click="handleResetDay" text-sm text-gray-400 hover:text-white>
          Desmarcar tudo
        </button>
      </div>
      <WorkoutDaySwitch v-model="selectedDay" :days="days" />
      <p text-xs text-gray-500 mt-3>{{ currentDay.label }}</p>
    </header>

    <div v-if="loading">
      <Spinner />
    </div>
    <main v-else flex-1 overflow-y-auto class="no-scrollbar" px-4 pb-6>
      <WorkoutGroup
        v-for="group in currentDay.groups"
        :key="group.name"
        :group="group"
        :completed="completed"
        @toggle="toggleExercise"
      />
    </main>
  </div>
</template>
