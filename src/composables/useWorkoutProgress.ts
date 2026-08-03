import { ref } from 'vue'
import { db } from '../firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

const progressRef = doc(db, 'workoutProgress', 'state')
const completed = ref<Record<string, boolean>>({})
const weights = ref<Record<string, number>>({})
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
    setDoc(progressRef, { completed: next }, { merge: true }).catch(console.error)
  }

  function resetExercises(ids: string[]) {
    const next = { ...completed.value }
    ids.forEach(id => { next[id] = false })
    completed.value = next
    setDoc(progressRef, { completed: next }, { merge: true }).catch(console.error)
  }

  function setWeight(id: string, weight: number) {
    const next = { ...weights.value, [id]: weight }
    weights.value = next
    setDoc(progressRef, { weights: next }, { merge: true }).catch(console.error)
  }

  return {
    completed,
    weights,
    loading,
    toggleExercise,
    resetExercises,
    setWeight
  }
}

function init() {
  onSnapshot(progressRef, snapshot => {
    completed.value = (snapshot.data()?.completed as Record<string, boolean>) || {}
    weights.value = (snapshot.data()?.weights as Record<string, number>) || {}
    loading.value = false
  })
}
