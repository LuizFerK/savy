import { ref } from 'vue'
import { db } from '../firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

const progressRef = doc(db, 'workoutProgress', 'state')
const completed = ref<Record<string, boolean>>({})
const loading = ref(true)

let initialized = false

export function useWorkoutProgress() {
  if (!initialized) {
    init()
    initialized = true
  }

  function toggleExercise(id: string) {
    const next = { ...completed.value, [id]: !completed.value[id] }
    completed.value = next
    setDoc(progressRef, { completed: next }).catch(console.error)
  }

  function resetExercises(ids: string[]) {
    const next = { ...completed.value }
    ids.forEach(id => { next[id] = false })
    completed.value = next
    setDoc(progressRef, { completed: next }).catch(console.error)
  }

  return {
    completed,
    loading,
    toggleExercise,
    resetExercises
  }
}

function init() {
  onSnapshot(progressRef, snapshot => {
    completed.value = (snapshot.data()?.completed as Record<string, boolean>) || {}
    loading.value = false
  })
}
