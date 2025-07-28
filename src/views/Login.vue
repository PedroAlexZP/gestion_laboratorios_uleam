<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="uleam-logo-text">ULEAM</div>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input
            type="text"
            id="username"
            v-model="loginForm.username"
            placeholder="Ingrese su usuario"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            placeholder="Ingrese su contraseña"
            required
            :disabled="loading"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Iniciando sesión...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>
      
      <div class="demo-users">
        <h3>Usuarios de Prueba:</h3>
        <div class="user-info">
          <p><strong>Administrador:</strong> admin / admin123</p>
          <p><strong>Usuario:</strong> usuario / user123</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const result = await authStore.login(loginForm.value.username, loginForm.value.password)
    if (result.success) {
      if (result.user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/user')
      }
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 20px;
}


.login-card {
  background: rgba(255,255,255,0.97);
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 350px;
  max-width: 400px;
  margin: 2rem 0;
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.uleam-logo-text {
  font-size: 3.2rem;
  font-weight: 900;
  color: #dc2626;
  letter-spacing: 0.18em;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-transform: uppercase;
  line-height: 1.1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.login-btn {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 0.75rem 0;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.2);
  transform: translateY(-2px);
}
.login-btn[disabled] {
  background: #f3f4f6;
  color: #b91c1c;
  cursor: not-allowed;
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

.demo-users {
  margin-top: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-size: 0.98rem;
}
.demo-users h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1a237e;
}
.user-info p {
  margin: 0 0 0.25rem 0;
  color: #333;
}
.login-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 350px;
  max-width: 400px;
  margin: 2rem 0;
}
.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.uleam-logo-text {
  font-size: 3.2rem;
  font-weight: 900;
  color: #dc2626;
  letter-spacing: 0.18em;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Montserrat', 'Arial', sans-serif;
  text-transform: uppercase;
  line-height: 1.1;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.form-group label {
  font-weight: 600;
  color: #333;
}
.form-group input {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
  width: 100%;
  background: #f9fafb;
  transition: border 0.2s;
}
.form-group input:focus {
  border: 1.5px solid #1a237e;
  outline: none;
}
.login-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.75rem 0;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.login-btn:hover:not(:disabled) {
  background: #1a237e;
  color: #fff;
  box-shadow: 0 4px 15px rgba(26,35,126,0.20);
  transform: translateY(-2px);
}
.login-btn[disabled] {
  background: #c5cae9;
  color: #fff;
  cursor: not-allowed;
}
.login-btn:hover:not([disabled]) {
  background: #3949ab;
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
.demo-users {
  margin-top: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  font-size: 0.98rem;
}
.demo-users h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #1a237e;
}
.user-info p {
  margin: 0 0 0.25rem 0;
  color: #333;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  border-radius: 50%;
  object-fit: cover;
}

.login-header h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header h2 {
  color: #666;
  font-size: 16px;
  font-weight: 400;
}

.login-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #fcc;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.demo-users {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.demo-users h3 {
  color: #333;
  font-size: 14px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.user-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.user-info strong {
  color: #333;
}

</style>

