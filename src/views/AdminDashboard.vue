<template>
  <div class="admin-dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-info">
          <h1>Panel de Administrador</h1>
          <p>Bienvenido, {{ user.name }}</p>
        </div>
        <button @click="logout" class="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <main class="dashboard-main">
      <div class="stats-grid">
  <div class="stat-card available">
    <div class="stat-icon">✅</div>
    <div class="stat-info">
      <h3>Laboratorios Disponibles</h3>
      <p class="stat-number">{{ availableLabsCount }}</p>
    </div>
  </div>
  <div class="stat-card occupied">
    <div class="stat-icon">🚫</div>
    <div class="stat-info">
      <h3>Laboratorios Ocupados</h3>
      <p class="stat-number">{{ occupiedLabsCount }}</p>
    </div>
  </div>
  <div class="stat-card maintenance">
    <div class="stat-icon">🛠️</div>
    <div class="stat-info">
      <h3>Laboratorios en Mantenimiento</h3>
      <p class="stat-number">{{ maintenanceLabsCount }}</p>
    </div>
  </div>
</div>

      <div class="admin-actions">
        <button @click="laboratoriesStore.resetLaboratories" class="lab-btn secondary" style="margin-bottom:1rem;">
          Restablecer laboratorios
        </button>
        <h2>Seleccionar Laboratorio</h2>
        <div class="laboratories-grid">
          <div class="lab-card">
            <div class="lab-header">
              <h3>FCVT</h3>
              <p>Facultad Ciencias de la Vida y Tecnologías</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="manageLaboratory('FCVT')">
                Gestionar
              </button>
            </div>
          </div>
          
          <div class="lab-card">
            <div class="lab-header">
              <h3>FACC</h3>
              <p>Facultad de Administración y Ciencias Contables</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="manageLaboratory('FACC')">
                Gestionar
              </button>
            </div>
          </div>
          
          <div class="lab-card">
            <div class="lab-header">
              <h3>FIIA</h3>
              <p>Facultad de Ingeniería, Industria y Arquitectura</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="manageLaboratory('FIIA')">
                Gestionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>


import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useLaboratoriesStore } from '../stores/laboratories'


    const router = useRouter()
    const authStore = useAuthStore()
    
    const user = computed(() => authStore.user)
    
    const logout = () => {
      authStore.logout()
      router.push('/login')
    }



const selectLaboratory = (labCode) => {
  router.push(`/laboratories/${labCode}`)
}

const manageLaboratory = (labCode) => {
  router.push(`/laboratories/${labCode}`)
}

const laboratoriesStore = useLaboratoriesStore()
const availableLabsCount = computed(() => laboratoriesStore.availableLabsCount)
const occupiedLabsCount = computed(() => laboratoriesStore.occupiedLabsCount)
const maintenanceLabsCount = computed(() => laboratoriesStore.maintenanceLabsCount)

</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f3f4f6;
}

.dashboard-header {
  background: #dc2626;
  color: #fff;
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

.user-info h1 {
  color: white;
  margin: 0;
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.01em;
}
.user-info p {
  color: white;
  margin: 0 0 0 1.5rem;
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.01em;
}


.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  transform: translateY(-2px);
}
.logout-btn:hover {
  background: #e3e6f3;
  color: #0d1333;
}

.dashboard-main {
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  padding: 0 2rem;
}


.admin-actions {
  margin-top: 2rem;
}
.admin-actions h2 {
  margin-bottom: 1rem;
}
.stats-grid {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}


.stat-card {
  background: rgba(255,255,255,0.97);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
  padding: 1.1rem 2.8rem 1.1rem 2.8rem;
  display: flex;
  align-items: center;
  min-width: 270px;
  max-width: 320px;
  flex: 0 0 320px;
  gap: 1.5rem;
  transition: box-shadow 0.2s;
}



.stat-icon {
  font-size: 2.7rem;
  margin-right: 0.7rem;
}


.stat-number {
  font-size: 2.2rem;
  font-weight: bold;
  color: #dc2626;
  margin: 0;
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
.lab-header {
  margin-bottom: 1.5rem;
}
.lab-header h3 {
  color: #333;
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
}
.lab-header p {
  margin: 0;
  color: #555;
  font-size: 1rem;
}
.lab-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
  margin: 0.2rem 0.3rem;
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


</style>

