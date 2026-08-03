<script setup lang="ts">
import { ref, computed } from 'vue'
import WorkoutDaySwitch from '../components/WorkoutDaySwitch.vue'
import WorkoutGroup from '../components/WorkoutGroup.vue'
import WorkoutWeightSheet from '../components/WorkoutWeightSheet.vue'
import Spinner from '../components/Spinner.vue'
import { useWorkoutProgress } from '../composables/useWorkoutProgress'
import { workoutDays } from '../data/workouts'
import type { WorkoutDayId } from '../types'
import { useConfirmModal } from '../composables/useConfirmModal'
import { capitalize } from '../utils'

const { completed, weights, loading, toggleExercise, resetExercises, setWeight } = useWorkoutProgress()
const { confirmModal } = useConfirmModal()

const selectedDay = ref<WorkoutDayId>('a')
const days = workoutDays.map(day => ({ id: day.id, label: day.label }))
const currentDay = computed(() => workoutDays.find(day => day.id === selectedDay.value)!)
const currentExerciseIds = computed(() =>
  currentDay.value.groups.flatMap(group => group.exercises.map(exercise => exercise.id))
)

async function handleResetDay() {
  if (await confirmModal('Desmarcar todos os exercícios deste dia?')) {
    resetExercises(currentExerciseIds.value)
  }
}

const weightSheetOpen = ref(false)
const selectedExerciseId = ref<string | null>(null)

const selectedExercise = computed(() => {
  if (!selectedExerciseId.value) return null
  for (const group of currentDay.value.groups) {
    const exercise = group.exercises.find(exercise => exercise.id === selectedExerciseId.value)
    if (exercise) return exercise
  }
  return null
})

function handleEditWeight(id: string) {
  selectedExerciseId.value = id
  weightSheetOpen.value = true
}

function handleSaveWeight(weight: number) {
  if (selectedExerciseId.value) {
    setWeight(selectedExerciseId.value, weight)
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
        :weights="weights"
        @toggle="toggleExercise"
        @edit-weight="handleEditWeight"
      />
    </main>

    <WorkoutWeightSheet
      v-model="weightSheetOpen"
      :exercise-name="selectedExercise ? capitalize(selectedExercise.name) : ''"
      :initial-value="selectedExerciseId ? weights[selectedExerciseId] : undefined"
      @save="handleSaveWeight"
    />
  </div>
</template>
