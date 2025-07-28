<template>
  <div class="lab-management">
    <header class="header">
      <div class="header-content">
        <div class="header-info">
          <button @click="goBack" class="back-btn">← Volver</button>
          <h1>Gestionar Laboratorio</h1>
        </div>
        <div class="user-info">
          <span>{{ userStore.user?.name || 'Administrador' }}</span>
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- Laboratory Info -->
        <div class="lab-info-card">
          <div class="lab-icon">🔬</div>
          <div class="lab-details">
            <h2>{{ laboratoryName }}</h2>
            <p>{{ facultyFullName }}</p>
            <div class="lab-specs">
              <span>{{ laboratory.description }}</span>
              <span class="current-status" :class="laboratory.status">
                Estado actual: {{ getStatusText(laboratory.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Management Form -->
        <div class="form-card">
          <h3>Gestión del Laboratorio</h3>
          
          <div class="management-options">
            <!-- Status Management -->
            <div class="option-section">
              <h4>Cambiar Estado del Laboratorio</h4>
              <div class="status-options">
                <label class="status-option">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="available"
                    name="status"
                  >
                  <div class="status-card available">
                    <div class="status-icon">✅</div>
                    <div class="status-info">
                      <h5>Disponible</h5>
                      <p>El laboratorio está operativo y disponible para reservas</p>
                    </div>
                  </div>
                </label>

                <label class="status-option">
                  <input 
                    type="radio" 
                    v-model="selectedStatus" 
                    value="maintenance"
                    name="status"
                  >
                  <div class="status-card maintenance">
                    <div class="status-icon">🔧</div>
                    <div class="status-info">
                      <h5>En Mantenimiento</h5>
                      <p>El laboratorio está en proceso de mantenimiento preventivo o correctivo</p>
                    </div>
                  </div>
                </label>

                
              </div>
            </div>

            <!-- Reason for Change -->
            <div class="option-section" v-if="selectedStatus !== laboratory.status">
              <h4>Motivo del Cambio</h4>
              <div class="form-group">
                <textarea 
                  v-model="changeReason"
                  placeholder="Describe el motivo del cambio de estado..."
                  class="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>

            <!-- Current Reservations Warning -->
            <div v-if="hasActiveReservations && selectedStatus !== 'available'" class="warning-section">
              <div class="warning-card">
                <div class="warning-icon">⚠️</div>
                <div class="warning-content">
                  <h5>Reservas Activas Detectadas</h5>
                  <p>Este laboratorio tiene {{ activeReservationsCount }} reserva(s) activa(s). 
                     Cambiar el estado puede afectar estas reservas.</p>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="notifyUsers">
                    Notificar a los usuarios afectados
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <button 
              type="button" 
              @click="goBack" 
              class="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              @click="updateStatus"
              :disabled="!canUpdateStatus"
              class="btn-primary"
            >
              {{ getActionButtonText() }}
            </button>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmation" class="modal-overlay" @click="closeConfirmation">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Confirmar Cambio de Estado</h3>
              <button @click="closeConfirmation" class="modal-close">×</button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas cambiar el estado del laboratorio?</p>
              <div class="confirmation-details">
                <p><strong>Laboratorio:</strong> {{ laboratoryName }}</p>
                <p><strong>Estado actual:</strong> {{ getStatusText(laboratory.status) }}</p>
                <p><strong>Nuevo estado:</strong> {{ getStatusText(selectedStatus) }}</p>
                <p v-if="changeReason"><strong>Motivo:</strong> {{ changeReason }}</p>
              </div>
            </div>
            <div class="modal-actions">
              <button @click="closeConfirmation" class="btn-secondary">Cancelar</button>
              <button @click="confirmStatusChange" class="btn-primary">Confirmar Cambio</button>
            </div>
          </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccess" class="modal-overlay" @click="closeSuccess">
          <div class="modal-content success-modal" @click.stop>
            <div class="modal-header">
              <h3>¡Cambio Realizado!</h3>
              <button @click="closeSuccess" class="modal-close">×</button>
            </div>
            <div class="modal-body">
              <div class="success-icon">✅</div>
              <p>El estado del laboratorio ha sido actualizado exitosamente.</p>
              <div class="status-change-summary">
                <p><strong>{{ laboratoryName }}</strong></p>
                <p>Nuevo estado: <span :class="selectedStatus">{{ getStatusText(selectedStatus) }}</span></p>
              </div>
            </div>
            <div class="modal-actions">
              <button @click="goToLabList" class="btn-primary">Volver a Lista</button>
              <button @click="closeSuccess" class="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const userStore = useAuthStore()

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

const selectedStatus = ref('')
const changeReason = ref('')
const notifyUsers = ref(true)
const showConfirmation = ref(false)
const showSuccess = ref(false)

const hasActiveReservations = ref(true)
const activeReservationsCount = ref(3)

const canUpdateStatus = computed(() => {
  if (selectedStatus.value === laboratory.value.status) return false
  if (!changeReason.value.trim()) return false
  return true
})

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
      status: Math.random() > 0.7 ? 'maintenance' : Math.random() > 0.5 ? 'occupied' : 'available'
    }
  }
}

function getStatusText(status) {
  switch (status) {
    case 'available': return 'Disponible';
    case 'occupied': return 'Ocupado';
    case 'maintenance': return 'En Mantenimiento';
    default: return status;
  }
}

function getActionButtonText() {
  if (selectedStatus.value === laboratory.value.status) {
    return 'Estado Actual';
  }
  return 'Actualizar Estado';
}

onMounted(() => {
  laboratory.value = generateLaboratory(facultyCode.value, labId.value)
  if (laboratory.value) {
    selectedStatus.value = laboratory.value.status
  }
})

function goBack() {
  router.push(`/laboratories/${facultyCode.value}`)
}

function logout() {
  userStore.logout()
  router.push('/login')
}

function updateStatus() {
  if (selectedStatus.value !== laboratory.value.status) {
    showConfirmation.value = true
  }
}

function closeConfirmation() {
  showConfirmation.value = false
}

function confirmStatusChange() {
  laboratoriesStore.setLabStatus(facultyCode.value, labId.value, selectedStatus.value)
  laboratory.value.status = selectedStatus.value
  showConfirmation.value = false
  showSuccess.value = true
}

function closeSuccess() {
  showSuccess.value = false
}

function goToLabList() {
  router.push(`/laboratories/${facultyCode.value}`)
}
</script>

<style scoped>
.lab-management {
  min-height: 100vh;
  background: #f3f4f6;
}

.header {
  background: #dc2626;
  padding: 1rem 0;
  border-bottom: 1px solid #b91c1c;
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

.lab-info-card, .warning-card, .modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.lab-info h3, .modal-header h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
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
  .lab-info-card, .warning-card, .modal-content {
    padding: 1rem;
  }
}


.header {
  background: #d01a1a;
  color: #fff;
  padding: 2rem 0 1rem 0;
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
  gap: 1.5rem;
}
.header-info h1 {
  font-size: 2rem;
  margin: 0;
}
.back-btn {
  background: #fff;
  color: #7e1a1a;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s;
  margin-right: 1rem;
}
.back-btn:hover {
  background: #e3e6f3;
  color: #0d1333;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.logout-btn {
  background: #fff;
  color: #1a237e;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  transition: background 0.2s, color 0.2s;
}
.logout-btn:hover {
  background: #e3e6f3;
  color: #0d1333;
}
.main-content {
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  padding: 0 2rem;
}
.container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 2rem;
}
.lab-info-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}
.lab-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.lab-details h2 {
  margin: 0 0 0.25rem 0;
  color: #1a237e;
  font-size: 1.2rem;
}
.lab-details p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}
.lab-specs {
  margin-top: 0.5rem;
  font-size: 0.98rem;
  font-weight: bold;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  display: flex;
  gap: 1.5rem;
}
.lab-specs .current-status {
  background: #e8f5e9;
  color: #388e3c;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-left: 1rem;
}
.lab-specs .current-status.maintenance {
  background: #fffde7;
  color: #fbc02d;
}
.lab-specs .current-status.out-of-service {
  background: #ffebee;
  color: #d32f2f;
}
.form-card {
  background: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  padding: 2rem 2.5rem;
  margin-bottom: 2rem;
}
.management-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.option-section {
  margin-bottom: 1.5rem;
}
.status-options {
  display: flex;
  gap: 2rem;
}
.status-option {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 1rem 1.5rem;
  margin-top: 0.5rem;
  border-left: 6px solid #1a237e;
}
.status-card.available {
  border-left: 6px solid #43a047;
}
.status-card.maintenance {
  border-left: 6px solid #fbc02d;
}
.status-card.out-of-service {
  border-left: 6px solid #e53935;
}
.status-icon {
  font-size: 2rem;
  margin-right: 1rem;
}
.status-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 1.05rem;
}
.status-info p {
  margin: 0;
  color: #555;
  font-size: 0.97rem;
}
.form-group {
  margin-top: 0.5rem;
}
.form-textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  background: #f9fafb;
  resize: vertical;
}
.warning-section {
  margin-top: 1rem;
}
.warning-card {
  background: #fffde7;
  border: 1.5px solid #fbc02d;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.warning-icon {
  font-size: 2rem;
  color: #fbc02d;
}
.warning-content h5 {
  margin: 0 0 0.25rem 0;
  color: #fbc02d;
  font-size: 1.05rem;
}
.warning-content p {
  margin: 0;
  color: #555;
  font-size: 0.97rem;
}
.checkbox-option {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  padding: 2rem 2.5rem;
  min-width: 340px;
  max-width: 400px;
  position: relative;
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
  font-size: 1.1rem;
  color: #1a237e;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}
.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  margin-right: 1rem;
}

.back-btn:hover, .logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-2px);
}

.header h1 {
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
  color: white;
}

.main-content {
  padding: 2rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.lab-info-card {
  background: rgba(255, 255, 255, 0.95);
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
  flex-wrap: wrap;
}

.current-status {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.current-status.available {
  background: #d1fae5;
  color: #065f46;
}

.current-status.maintenance {
  background: #fef3c7;
  color: #92400e;
}

.current-status.out-of-service {
  background: #fee2e2;
  color: #991b1b;
}

.form-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.form-card h3 {
  color: #dc2626;
  margin: 0 0 2rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.option-section {
  margin-bottom: 2rem;
}

.option-section h4 {
  color: #374151;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.status-options {
  display: grid;
  gap: 1rem;
}

.status-option {
  cursor: pointer;
}

.status-option input[type="radio"] {
  display: none;
}

.status-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.status-option input[type="radio"]:checked + .status-card {
  border-color: #dc2626;
  background: #fef2f2;
}

.status-card:hover {
  border-color: #dc2626;
  transform: translateY(-2px);
}

.status-icon {
  font-size: 2rem;
}

.status-info h5 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.status-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #dc2626;
}

.warning-section {
  margin-bottom: 2rem;
}

.warning-card {
  background: #fef3c7;
  border: 2px solid #f59e0b;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.warning-icon {
  font-size: 2rem;
}

.warning-content h5 {
  margin: 0 0 0.5rem 0;
  color: #92400e;
}

.warning-content p {
  margin: 0 0 1rem 0;
  color: #92400e;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #92400e;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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

.status-change-summary {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 2px solid #0ea5e9;
}

.status-change-summary p {
  margin: 0.25rem 0;
}

.status-change-summary span.available {
  color: #065f46;
  font-weight: 600;
}

.status-change-summary span.maintenance {
  color: #92400e;
  font-weight: 600;
}

.status-change-summary span.out-of-service {
  color: #991b1b;
  font-weight: 600;
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
  
  .form-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>

<script setup>
  
</script>
