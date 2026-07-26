import type { WorkoutDay } from '../types'

export const workoutDays: WorkoutDay[] = [
  {
    id: 'a',
    label: 'Puxar (Costas & Bíceps)',
    groups: [
      {
        name: 'Costas',
        exercises: [
          { id: 'a-costas-1', name: 'Puxada Alta na Polia (ou Barra Fixa)', sets: '3 a 4 séries de 8 a 12 repetições' },
          { id: 'a-costas-2', name: 'Remada Curvada com Barra', sets: '3 a 4 séries de 8 a 10 repetições' },
          { id: 'a-costas-3', name: 'Remada Baixa Triângulo', sets: '3 séries de 10 a 12 repetições' },
          { id: 'a-costas-4', name: 'Pulldown na Polia (Foco em Grande Dorsal)', sets: '3 séries de 12 a 15 repetições' },
        ]
      },
      {
        name: 'Bíceps',
        exercises: [
          { id: 'a-biceps-1', name: 'Rosca Direta com Barra (Barra W ou Reta)', sets: '3 séries de 8 a 10 repetições' },
          { id: 'a-biceps-2', name: 'Rosca Alternada no Banco Inclinado', sets: '3 séries de 10 a 12 repetições' },
          { id: 'a-biceps-3', name: 'Rosca Martelo com Halteres', sets: '3 séries de 10 a 12 repetições' },
          { id: 'a-biceps-4', name: 'Rosca Concentrada ou Rosca Scott', sets: '3 séries de 12 a 15 repetições' },
        ]
      }
    ]
  },
  {
    id: 'b',
    label: 'Empurrar (Peito & Tríceps)',
    groups: [
      {
        name: 'Peito',
        exercises: [
          { id: 'b-peito-1', name: 'Supino Reto (com Barra ou Halteres)', sets: '3 a 4 séries de 6 a 10 repetições' },
          { id: 'b-peito-2', name: 'Supino Inclinado com Halteres', sets: '3 a 4 séries de 8 a 12 repetições' },
          { id: 'b-peito-3', name: 'Crossover / Crucifixo na Polia', sets: '3 séries de 10 a 12 repetições' },
          { id: 'b-peito-4', name: 'Peck Deck (Voador Máquina)', sets: '3 séries de 12 a 15 repetições' },
        ]
      },
      {
        name: 'Tríceps',
        exercises: [
          { id: 'b-triceps-1', name: 'Tríceps Testa (com Barra W ou Halteres)', sets: '3 séries de 8 a 10 repetições' },
          { id: 'b-triceps-2', name: 'Tríceps Pulley (Corda)', sets: '3 séries de 10 a 12 repetições' },
          { id: 'b-triceps-3', name: 'Tríceps Testa na Polia ou Tríceps Francês', sets: '3 séries de 10 a 12 repetições' },
          { id: 'b-triceps-4', name: 'Mergulho nas Paralelas (ou Banco)', sets: '3 séries até a falha técnica' },
        ]
      }
    ]
  },
  {
    id: 'c',
    label: 'Pernas (Quadríceps, Posterior & Panturrilha)',
    groups: [
      {
        name: 'Quadríceps',
        exercises: [
          { id: 'c-quadriceps-1', name: 'Agachamento Livre (com Barra)', sets: '3 a 4 séries de 6 a 10 repetições' },
          { id: 'c-quadriceps-2', name: 'Leg Press 45°', sets: '3 a 4 séries de 10 a 12 repetições' },
          { id: 'c-quadriceps-3', name: 'Cadeira Extensora', sets: '3 séries de 12 a 15 repetições' },
          { id: 'c-quadriceps-4', name: 'Afundo / Passada com Halteres', sets: '3 séries de 10 a 12 repetições (cada perna)' },
        ]
      },
      {
        name: 'Posterior de Coxa',
        exercises: [
          { id: 'c-posterior-1', name: 'Stiff com Barra ou Halteres', sets: '3 a 4 séries de 8 a 10 repetições' },
          { id: 'c-posterior-2', name: 'Mesa Flexora', sets: '3 séries de 10 a 12 repetições' },
          { id: 'c-posterior-3', name: 'Cadeira Flexora', sets: '3 séries de 12 a 15 repetições' },
          { id: 'c-posterior-4', name: 'Elevador Pélvico / Elevação de Quadril (opcional)', sets: '3 séries de 10 a 12 repetições' },
        ]
      },
      {
        name: 'Panturrilha',
        exercises: [
          { id: 'c-panturrilha-1', name: 'Gêmeos em Pé (no Smith ou Máquina)', sets: '4 a 5 séries de 12 a 15 repetições (amplitude máxima, pausa no topo)' },
        ]
      }
    ]
  }
]
