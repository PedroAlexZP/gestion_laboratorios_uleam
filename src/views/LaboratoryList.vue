<template>
  <div class="laboratory-list">
    <header class="header">
      <div class="header-content">
        <div class="header-info">
          <button @click="goBack" class="back-btn">← Volver</button>
          <h1>Laboratorios - {{ facultyName }}</h1>
        </div>
        <div class="user-info">
          <span>{{ userStore.user?.name || 'Usuario' }}</span>
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <div class="faculty-info">
          <h2>{{ facultyFullName }}</h2>
          <p>Selecciona un laboratorio para continuar</p>
        </div>
        
        <div v-if="laboratories.length === 0" class="error-message">
          <h2>No hay laboratorios registrados para esta facultad</h2>
        </div>
        <div v-else class="laboratories-grid">
          <div 
            v-for="lab in laboratories" 
            :key="lab.id"
            class="lab-card"
          >
            <div class="lab-icon">
              🔬
            </div>
            <div class="lab-info">
              <h3>{{ lab.name }}</h3>
              <p>{{ lab.description }}</p>
              <!-- Desaparecen personas y equipos, solo descripción -->
            </div>
            <div class="lab-status" :class="lab.status">
              {{ getStatusText(lab.status) }}
            </div>
            
            <!-- Action buttons -->
            <div class="lab-actions">
              <button 
                v-if="userStore.user?.role === 'user' && lab.status === 'available'"
                @click="selectLaboratory(lab)"
                class="lab-btn primary"
              >
                Reservar
              </button>
              <button 
                v-if="userStore.user?.role === 'user' && lab.status === 'occupied'"
                disabled
                class="lab-btn disabled"
              >
                Ocupado
              </button>
              <button 
                v-if="userStore.user?.role === 'user' && lab.status === 'maintenance'"
                disabled
                class="lab-btn disabled"
              >
                No Disponible
              </button>
              <button 
                v-if="userStore.user?.role === 'admin'"
                @click="manageLaboratory(lab)"
                class="lab-btn primary"
              >
                Gestionar
              </button>
            </div>
          </div>
        </div>
      </div>
          <!-- Modal de gestión para administrador -->
      <div v-if="showManageModal" class="modal-overlay" @click="closeManageModal">
        <div class="modal-content" @click.stop>
          <h3>Gestionar laboratorio</h3>
          <p><strong>{{ labToManage?.name }}</strong></p>
          <div style="margin: 1rem 0;">
            <button class="lab-btn" @click="setLabStatus('available')">Marcar como Disponible</button>
            <button class="lab-btn" @click="setLabStatus('occupied')">Marcar como Ocupado</button>
            <button class="lab-btn" @click="setLabStatus('maintenance')">Marcar como Mantenimiento</button>
          </div>
          <button class="lab-btn secondary" @click="closeManageModal">Cerrar</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLaboratoriesStore } from '../stores/laboratories'

const router = useRouter()
const route = useRoute()
const userStore = useAuthStore()

const facultyCode = computed(() => route.params.faculty)
const facultyName = computed(() => facultyCode.value)

const facultyFullName = computed(() => {
  const names = {
    'FCVT': 'Facultad Ciencias de la Vida y Tecnologías',
    'FACC': 'Facultad de Administración y Ciencias Contables',
    'FIIA': 'Facultad de Ingeniería, Industria y Arquitectura'
  }
  return names[facultyCode.value] || 'Facultad'
})

const laboratoriesStore = useLaboratoriesStore()
const laboratories = computed(() => laboratoriesStore.getLaboratories(facultyCode.value))

const goBack = () => {
  if (userStore.user?.role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/user')
  }
}

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const selectLaboratory = (lab) => {
  if (userStore.user?.role === 'user') {
    router.push(`/reserve/${facultyCode.value}/${lab.id}`)
  } else {
    console.log(`Administrador seleccionó: ${lab.name}`)
    alert(`Funcionalidad de administración para: ${lab.name}`)
  }
}

const getStatusText = (status) => {
  if (status === 'available') return 'Disponible'
  if (status === 'occupied') return 'Ocupado'
  if (status === 'maintenance') return 'En mantenimiento'
  return 'Desconocido'
}

const showManageModal = ref(false)
const labToManage = ref(null)

const manageLaboratory = (lab) => {
  labToManage.value = lab
  showManageModal.value = true
}

const closeManageModal = () => {
  showManageModal.value = false
  labToManage.value = null
}

const setLabStatus = (status) => {
  if (labToManage.value) {
    laboratoriesStore.setLabStatus(facultyCode.value, labToManage.value.id, status)
    closeManageModal()
  }
}
</script>

    const labToManage = ref(null)

    const manageLaboratory = (lab) => {
      labToManage.value = lab
      showManageModal.value = true
    }

    const closeManageModal = () => {
      showManageModal.value = false
      labToManage.value = null
    }

    const setLabStatus = (status) => {
      if (labToManage.value) {
        laboratoriesStore.setLabStatus(facultyCode.value, labToManage.value.id, status)
        closeManageModal()
      }
    }

    return {
      userStore,
      facultyName,
      facultyFullName,
      laboratories,
      goBack,
      logout,
      selectLaboratory,
      getStatusText,
      showManageModal,
      labToManage,
      manageLaboratory,
      closeManageModal,


<style scoped>
.laboratory-list {
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

.faculty-info h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  font-weight: 700;
}
.faculty-info p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.laboratories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.lab-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.lab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.15);
}

.lab-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.lab-info h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}
.lab-info p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
}

.lab-status {
  margin-top: 0.5rem;
  font-size: 0.98rem;
  font-weight: bold;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  display: inline-block;
}
.lab-status.available {
  background: #f3f4f6;
  color: #388e3c;
}
.lab-status.occupied {
  background: #fff3f3;
  color: #dc2626;
}
.lab-status.maintenance {
  background: #fffde7;
  color: #fbc02d;
}
.lab-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}
.lab-btn {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
  font-size: 0.95rem;
}
.lab-btn.primary {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
}
.lab-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
}

.lab-btn.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}
.lab-btn.secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
}
.lab-btn.disabled,
.lab-btn:disabled {
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
  .laboratories-grid {
    grid-template-columns: 1fr;
  }
  .lab-card {
    padding: 1rem;
  }
}


.header {
  background: #dc2626;
  color: #fff;
  padding: 1rem 0;
  border-bottom: 1px solid #b91c1c;
}

.header-content h1 {
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.01em;
}
.header-content .user-info p {
  color: white;
  margin: 0 0 0 1.5rem;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
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
  color: #dc2626;
  font-weight: 900;
  letter-spacing: 0.08em;
}
.back-btn {
  background: #fff;
  color: #1a237e;
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
.faculty-info {
  margin-bottom: 2rem;
}
.faculty-info h2 {
  margin: 0 0 0.25rem 0;
  color: #1a237e;
  font-size: 1.2rem;
}
.faculty-info p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}
.error-message {
  color: #e53935;
  background: #fff3f3;
  border: 1px solid #e53935;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  margin-bottom: 2rem;
}
.laboratories-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}
.lab-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  position: relative;
  flex: 1 1 260px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.lab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.lab-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.lab-info h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}
.lab-info p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}
.lab-status {
  margin-top: 0.5rem;
  font-size: 0.98rem;
  font-weight: bold;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  display: inline-block;
}
.lab-status.available {
  background: #e8f5e9;
  color: #388e3c;
}
.lab-status.occupied {
  background: #ffebee;
  color: #d32f2f;
}
.lab-status.maintenance {
  background: #fffde7;
  color: #fbc02d;
}
.lab-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.lab-btn {
  display: inline-block;
  padding: 0.5rem 1.3rem;
  border: none;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1rem;
  margin: 0.2rem 0.3rem;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.08);
}
.lab-btn.primary {
  background: #2563eb;
  color: #fff;
}
.lab-btn.primary:hover {
  background: #1a237e;
}
.lab-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 2px solid #d1d5db;
}
.lab-btn.secondary:hover {
  background: #e5e7eb;
  color: #1a237e;
}

.lab-btn.primary {
  background: #2563eb;
  color: #fff;
}

.lab-btn.secondary {
  background: #e0e7ef;
  color: #2563eb;
  border: 1px solid #2563eb;
}

.lab-btn.disabled,
.lab-btn:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  border: none;
}

.lab-btn:hover:not(:disabled) {
  background: #1746a2;
  color: #fff;
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  min-width: 300px;
  max-width: 90vw;
  box-shadow: 0 4px 32px rgba(0,0,0,0.13);
  text-align: center;
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

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.header h1 {
  color: white;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 300;
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
  max-width: 1200px;
  margin: 0 auto;
}

.faculty-info {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.faculty-info h2 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.faculty-info p {
  color: #6b7280;
  margin: 0;
  font-size: 1.1rem;
}

.laboratories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.lab-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  position: relative;
}

.lab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.lab-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 1rem;
}

.lab-info h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.lab-info p {
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.lab-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #4b5563;
}

.lab-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.lab-status.available {
  background: #d1fae5;
  color: #065f46;
}

.lab-status.occupied {
  background: #fee2e2;
  color: #991b1b;
}
.lab-status.maintenance {
  background: #fef9c3;
  color: #b45309;
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
  
  .laboratories-grid {
    grid-template-columns: 1fr;
  }
  
  .lab-details {
    flex-direction: column;
    gap: 0.5rem;
  }
}

</style>

<script setup>

</script>
