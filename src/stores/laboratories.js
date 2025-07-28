import { defineStore } from 'pinia'

// Datos simulados globales para laboratorios
const labDescriptions = {
  'FCVT': [
    'Laboratorio 1 FCVT',
    'Laboratorio 2 FCVT',
    'Laboratorio 3 FCVT',
    'Laboratorio 4 FCVT'
  ],
  'FACC': [
    'Laboratorio 1 FACC',
    'Laboratorio 2 FACC',
    'Laboratorio 3 FACC',
    'Laboratorio 4 FACC'
  ],
  'FIIA': [
    'Laboratorio 1 FIIA',
    'Laboratorio 2 FIIA',
    'Laboratorio 3 FIIA',
    'Laboratorio 4 FIIA'
  ]
}

const labNumbers = {
  'FCVT': [1, 2, 3, 4],
  'FACC': [5, 6, 7, 8],
  'FIIA': [9, 10, 11, 12]
}

function generateLabsForFaculty(faculty) {
  const descriptions = labDescriptions[faculty] || []
  const numbers = labNumbers[faculty] || []
  return descriptions.map((description, index) => ({
    id: `${faculty}-${numbers[index]}`,
    name: `LAB ${numbers[index]} (${faculty})`,
    description: description,
    status: 'available'
  }))
}

export const useLaboratoriesStore = defineStore('laboratories', {
  state: () => ({
    laboratoriesByFaculty: JSON.parse(localStorage.getItem('laboratoriesByFaculty')) || {
      'FCVT': generateLabsForFaculty('FCVT'),
      'FACC': generateLabsForFaculty('FACC'),
      'FIIA': generateLabsForFaculty('FIIA'),
    }
  }),
  actions: {
    saveToLocalStorage() {
      localStorage.setItem('laboratoriesByFaculty', JSON.stringify(this.laboratoriesByFaculty));
    },
    getLaboratories(faculty) {
      return this.laboratoriesByFaculty[faculty] || []
    },
    getLaboratory(faculty, labId) {
      const labs = this.laboratoriesByFaculty[faculty]
      return labs ? labs.find(l => l.id === labId) : null
    },
    setLabStatus(faculty, labId, status) {
      const labs = this.laboratoriesByFaculty[faculty]
      if (!labs) return
      const labIndex = labs.findIndex(l => l.id === labId)
      if (labIndex !== -1) {
        labs[labIndex] = { ...labs[labIndex], status }
        this.laboratoriesByFaculty[faculty] = [...labs]
        this.laboratoriesByFaculty = { ...this.laboratoriesByFaculty }
        this.saveToLocalStorage();
      }
    },
    resetLaboratories() {
      // Elimina la clave de localStorage para forzar la regeneración
      localStorage.removeItem('laboratoriesByFaculty');
      this.laboratoriesByFaculty = {
        'FCVT': generateLabsForFaculty('FCVT'),
        'FACC': generateLabsForFaculty('FACC'),
        'FIIA': generateLabsForFaculty('FIIA'),
      };
      this.saveToLocalStorage();
    }
  },
  getters: {
    availableLabsCount: (state) => {
      let count = 0;
      Object.values(state.laboratoriesByFaculty).forEach(labs => {
        count += labs.filter(lab => lab.status === 'available').length;
      });
      return count;
    },
    occupiedLabsCount: (state) => {
      let count = 0;
      Object.values(state.laboratoriesByFaculty).forEach(labs => {
        count += labs.filter(lab => lab.status === 'occupied').length;
      });
      return count;
    },
    maintenanceLabsCount: (state) => {
      let count = 0;
      Object.values(state.laboratoriesByFaculty).forEach(labs => {
        count += labs.filter(lab => lab.status === 'maintenance').length;
      });
      return count;
    }
  }
})
