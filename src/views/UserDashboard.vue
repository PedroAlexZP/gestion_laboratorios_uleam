<template>
  <div class="user-dashboard">
    <header class="header">
      <div class="header-content">
        <h1>Panel de Usuario</h1>
        <div class="user-info">
          <span>Bienvenido, {{ userStore.user?.name || 'Usuario' }}</span>
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="dashboard-container">
        <h2>Seleccionar Laboratorio</h2>
        
        <div class="laboratories-grid">
          <div class="lab-card">
            <div class="lab-header">
              <h3>FCVT</h3>
              <p>Facultad Ciencias de la Vida y Tecnologías</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="selectLaboratory('FCVT')">
                Laboratorio
              </button>
            </div>
          </div>
          
          <div class="lab-card">
            <div class="lab-header">
              <h3>FACC</h3>
              <p>Facultad de Administración y Ciencias Contables</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="selectLaboratory('FACC')">
                Laboratorio
              </button>
            </div>
          </div>
          
          <div class="lab-card">
            <div class="lab-header">
              <h3>FIIA</h3>
              <p>Facultad de Ingeniería, Industria y Arquitectura</p>
            </div>
            <div class="lab-actions">
              <button class="lab-btn primary" @click="selectLaboratory('FIIA')">
                Laboratorio
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>


import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'


    const router = useRouter()
    const userStore = useAuthStore()

    const logout = () => {
      userStore.logout()
      router.push('/login')
    }

    const selectLaboratory = (labCode) => {
      // Navigate to laboratory list view for the selected faculty
      router.push(`/laboratories/${labCode}`)
    }


</script>

<style scoped>
.user-dashboard {
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

.header h1 {
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

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dashboard-container h2 {
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  font-weight: 300;
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
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.lab-header h3 {
  color: #dc2626;
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.lab-header p {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  font-size: 0.95rem;
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

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-container {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>
