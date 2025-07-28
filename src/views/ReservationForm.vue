<template>
  <div class="reservation-form">
    <header class="header">
      <div class="header-content">
        <div class="header-info">
          <button @click="goBack" class="back-btn">← Volver</button>
          <h1>Reservar Laboratorio</h1>
        </div>
        <div class="user-info">
          <span>{{ userStore.user?.name || 'Usuario' }}</span>
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <div v-if="!laboratory || Object.keys(laboratory).length === 0 || !['available','occupied','maintenance'].includes(laboratory.status)" class="error-message">
          <h2>No se encontró el laboratorio</h2>
          <p>Verifica la URL o selecciona un laboratorio válido.</p>
          <button @click="goBack" class="back-btn">← Volver</button>
          <div style="margin-top:2rem; color:#888;">Facultad: {{ facultyFullName }}<br>ID laboratorio: {{ labId }}</div>
        </div>
        <template v-else>
          <!-- Laboratory Info -->
          <div class="lab-info-card">
            <div class="lab-icon">🔬</div>
            <div class="lab-details"></div>
            <form @submit.prevent="submitReservation">
              <h2>{{ laboratoryName }}</h2>
              <p>{{ facultyFullName }}</p>
              <div class="lab-specs">
                <label for="date">Fecha de la reserva</label>
                <input 
                  type="date" 
                  id="date"
                  v-model="formData.date"
                  :min="minDate"
                  required
                  class="form-input"
                >
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="startTime">Hora de inicio</label>
                  <input 
                    type="time" 
                    id="startTime"
                    v-model="formData.startTime"
                    required
                    class="form-input"
                  >
                </div>

                <div class="form-group">
                  <label for="endTime">Hora de fin</label>
                  <input 
                    type="time" 
                    id="endTime"
                    v-model="formData.endTime"
                    required
                    class="form-input"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="purpose">Propósito de la reserva (opcional)</label>
                <textarea 
                  id="purpose"
                  v-model="formData.purpose"
                  placeholder="Describe brevemente el propósito de tu reserva..."
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>

              <!-- Validation Messages -->
              <div v-if="validationError" class="error-message">
                {{ validationError }}
              </div>

              <!-- Reservation Summary -->
              <div v-if="isFormValid" class="reservation-summary">
                <h4>Resumen de la reserva</h4>
                <div class="summary-details">
                  <p><strong>Laboratorio:</strong> {{ laboratoryName }}</p>
                  <p><strong>Fecha:</strong> {{ formattedDate }}</p>
                  <p><strong>Horario:</strong> {{ formData.startTime }} - {{ formData.endTime }}</p>
                  <p><strong>Duración:</strong> {{ duration }}</p>
                  <p v-if="formData.purpose"><strong>Propósito:</strong> {{ formData.purpose }}</p>
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="button" 
                  @click="goBack" 
                  class="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  :disabled="!isFormValid"
                  class="btn-primary"
                >
                  Confirmar Reserva
                </button>
              </div>
            </form>
          </div>

          <!-- Confirmation Modal -->
          <div v-if="showConfirmation" class="modal-overlay" @click="closeConfirmation">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>Confirmar Reserva</h3>
                <button @click="closeConfirmation" class="modal-close">×</button>
              </div>
              <div class="modal-body">
                <p>¿Estás seguro de que deseas reservar este laboratorio?</p>
                <div class="confirmation-details">
                  <p><strong>{{ laboratoryName }}</strong></p>
                  <p>{{ formattedDate }} de {{ formData.startTime }} a {{ formData.endTime }}</p>
                  <p>Duración: {{ duration }}</p>
                </div>
                <p class="warning-text">Una vez confirmada, la reserva no podrá ser modificada sin contactar al administrador.</p>
              </div>
              <div class="modal-actions">
                <button @click="closeConfirmation" class="btn-secondary">Cancelar</button>
                <button @click="confirmReservation" class="btn-primary">Sí, Confirmar</button>
              </div>
            </div>
          </div>

          <!-- Success Modal -->
          <div v-if="showSuccess" class="modal-overlay" @click="closeSuccess">
            <div class="modal-content success-modal" @click.stop>
              <div class="modal-header">
                <h3>Laboratorio reservado con éxito</h3>
              </div>
              <div class="modal-body">
                <p>Laboratorio reservado con éxito.</p>
              </div>
              <div class="modal-actions" style="justify-content:center;">
                <button @click="closeSuccess" class="btn-primary">Cerrar</button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>

import { computed, ref, onMounted, watch } from 'vue'

// ...
// submitReservation muestra el modal de confirmación


import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLaboratoriesStore } from '../stores/laboratories'

const router = useRouter()
const route = useRoute()
const userStore = useAuthStore()
const laboratoriesStore = useLaboratoriesStore()

const facultyCode = computed(() => route.params.faculty)
const labId = computed(() => route.params.labId)

const laboratory = ref({})
const laboratoryName = computed(() => laboratory.value.name || '')

const facultyFullName = computed(() => {
  const names = {
    'FCVT': 'Facultad Ciencias de la Vida y Tecnologías',
    'FACC': 'Facultad de Administración y Ciencias Contables',
    'FIIA': 'Facultad de Ingeniería, Industria y Arquitectura'
  }
  return names[facultyCode.value] || 'Facultad'
})

const formData = ref({
  date: '',
  startTime: '',
  endTime: '',
  purpose: ''
})

const validationError = ref('')
const showConfirmation = ref(false)
const showSuccess = ref(false)
const reservationCode = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const formattedDate = computed(() => {
  if (!formData.value.date) return ''
  const date = new Date(formData.value.date)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

const duration = computed(() => {
  if (!formData.value.startTime || !formData.value.endTime) return ''

  const start = new Date(`2000-01-01T${formData.value.startTime}`)
  const end = new Date(`2000-01-01T${formData.value.endTime}`)
  const diff = end - start

  if (diff <= 0) return 'Horario inválido'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours === 0) return `${minutes} minutos`
  if (minutes === 0) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
  return `${hours}h ${minutes}m`
})

const isFormValid = computed(() => {
  if (!formData.value.date || !formData.value.startTime || !formData.value.endTime) {
    return false
  }

  const start = new Date(`2000-01-01T${formData.value.startTime}`)
  const end = new Date(`2000-01-01T${formData.value.endTime}`)

  return end > start
})

const validateForm = () => {
  validationError.value = ''

  if (!formData.value.date || !formData.value.startTime || !formData.value.endTime) {
    validationError.value = 'Por favor completa todos los campos obligatorios.'
    return false
  }

  const start = new Date(`2000-01-01T${formData.value.startTime}`)
  const end = new Date(`2000-01-01T${formData.value.endTime}`)

  // Restricción de horario permitido
  const minTime = new Date('2000-01-01T08:00')
  const maxTime = new Date('2000-01-01T20:00')

  if (start < minTime || end > maxTime) {
    validationError.value = 'Solo se puede reservar entre las 08:00 y las 20:00.'
    return false
  }

  if (end <= start) {
    validationError.value = 'La hora de fin debe ser posterior a la hora de inicio.'
    return false
    return false
  }

  return true
}

const generateLaboratory = (faculty, labId) => {
  const labNumbers = {
    'FCVT': [1, 2, 3, 4],
    'FACC': [5, 6, 7, 8],
    'FIIA': [9, 10, 11, 12]
  }

  const numbers = labNumbers[faculty] || []
  const labNumber = numbers.find(num => `${faculty}-${num}` === labId)

  if (labNumber) {
    return {
      id: labId,
      name: `LAB ${labNumber} (${faculty})`,
      capacity: Math.floor(Math.random() * 20) + 15,
      equipment: Math.floor(Math.random() * 15) + 10,
      status: 'available'
    }
  }

  return null
}

onMounted(() => {
  console.log('[ReservationForm] onMounted:', facultyCode.value, labId.value)
  laboratory.value = laboratoriesStore.getLaboratory(facultyCode.value, labId.value)
  console.log('[ReservationForm] laboratory:', laboratory.value)
  if (!laboratory.value) {
    router.push(`/laboratories/${facultyCode.value}`)
  }
})

watch([facultyCode, labId], ([newFaculty, newLabId]) => {
  console.log('[ReservationForm] watch facultyCode/labId:', newFaculty, newLabId)
  laboratory.value = laboratoriesStore.getLaboratory(newFaculty, newLabId)
  console.log('[ReservationForm] laboratory:', laboratory.value)
  if (!laboratory.value) {
    router.push(`/laboratories/${newFaculty}`)
  }
})

const goBack = () => {
  router.push(`/laboratories/${facultyCode.value}`)
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const submitReservation = () => {
  if (validateForm()) {
    showConfirmation.value = true
  }
}

const closeConfirmation = () => {
  showConfirmation.value = false
}

const confirmReservation = () => {
  // Generate reservation code
  const timestamp = Date.now().toString().slice(-6)
  const labCode = laboratory.value.name.replace(/[^0-9]/g, '')
  reservationCode.value = `RES-${labCode}-${timestamp}`

  // Actualizar estado global del laboratorio a 'occupied'
  laboratoriesStore.setLabStatus(facultyCode.value, labId.value, 'occupied')

  // Aquí normalmente guardarías la reserva en una base de datos
  console.log('Reserva confirmada:', {
    laboratory: laboratory.value,
    ...formData.value,
    user: userStore.user,
    code: reservationCode.value
  })

  showConfirmation.value = false
  showSuccess.value = true
}

const closeSuccess = () => {
  showSuccess.value = false
  goBack()
}

</script>

<style scoped>
.reservation-form {
  min-height: 100vh;
  background: #f3f4f6;
  font-family: 'Montserrat', 'Arial', sans-serif;
}

.header {
  background: #dc2626;
  padding: 1rem 0;
  border-bottom: 1px solid #b91c1c;
}

.header-info h1 {
  color: #fff;
  margin: 0;
  padding: 0;
  font-size: 2.3rem;
  font-weight: 900;
  font-family: 'Montserrat', 'Arial', sans-serif;
  letter-spacing: 0.08em;
}



.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info h1 {
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.main-content {
  padding: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.lab-info-card, .modal-content, .success-modal {
  background: rgba(255,255,255,0.96);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.10);
  border: 1px solid #e5e7eb;
}

.lab-info h3, .modal-header h3 {
  color: #222;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.lab-info h2, .modal-header h2, .lab-info-card h2 {
  color: #222;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.lab-info p, .modal-body p, .confirmation-details p {
  color: #444;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.lab-info p, .modal-body p, .confirmation-details p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-input, .form-textarea {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  width: 100%;
  background: #f9fafb;
  transition: border 0.2s, box-shadow 0.2s;
  margin-top: 0.25rem;
}
.form-input:focus, .form-textarea:focus {
  border: 1.5px solid #dc2626;
  outline: none;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.10);
}

.reservation-summary {
  background: rgba(255,255,255,0.93);
  border-radius: 10px;
  border: 1px solid #dc2626;
  padding: 1.2rem 1.5rem;
  margin: 1.5rem 0 0 0;
  box-shadow: 0 2px 10px rgba(220,38,38,0.06);
}
.summary-details p {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.error-message {
  color: #e53935;
  background: #fff3f3;
  border: 1px solid #e53935;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1rem;
}


.btn-primary {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
}
.btn-primary:disabled, .btn-secondary:disabled {
  background: #f3f4f6;
  color: #b91c1c;
  cursor: not-allowed;
  border: none;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  .container {
    margin: 1rem;
    padding: 1rem;
  }
  .lab-info-card, .modal-content, .success-modal {
    padding: 1rem;
  }
}

.header {
  background: #dc2626;
  color: #fff;
  padding: 1rem 0;
  border-bottom: 1px solid #b91c1c;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}


.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn, .logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.9rem;
}

.back-btn:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.20);
}




.header-info h1 {
  font-size: 2rem;
  margin: 0;
  color: #dc2626;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #fff;
}

.main-content {
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.lab-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 2rem;
  border: 1px solid #e5e7eb;
}

.lab-icon {
  font-size: 4rem;
}

.lab-details h2 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.lab-details p {
  color: #6b7280;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.lab-specs {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-card h3 {
  color: #dc2626;
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #dc2626;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
}

.reservation-summary {
  background: #f0f9ff;
  border: 2px solid #0ea5e9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.reservation-summary h4 {
  color: #0c4a6e;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.summary-details p {
  margin: 0.5rem 0;
  color: #374151;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: #1a237e;
  color: #fff;
  box-shadow: 0 4px 15px rgba(26,35,126,0.20);
  transform: translateY(-2px);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 15px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #dc2626;
  font-size: 1.3rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #dc2626;
}

.modal-body {
  padding: 2rem;
}

.confirmation-details {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.confirmation-details p {
  margin: 0.25rem 0;
  color: #374151;
}

.warning-text {
  color: #d97706;
  font-size: 0.9rem;
  font-style: italic;
  margin-top: 1rem;
}

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.success-modal .modal-body {
  text-align: center;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.reservation-code {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 2px solid #0ea5e9;
}

.reservation-code p {
  margin: 0;
  font-family: monospace;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-info {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .lab-info-card {
    flex-direction: column;
    text-align: center;
  }
  
  .lab-specs {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>
