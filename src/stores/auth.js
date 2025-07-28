import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),

  actions: {
    async login(username, password) {
      // Simulación de usuarios predefinidos
      const users = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          name: 'Administrador ULEAM',
          email: 'admin@uleam.edu.ec'
        },
        {
          id: 2,
          username: 'usuario',
          password: 'user123',
          role: 'user',
          name: 'Usuario ULEAM',
          email: 'usuario@uleam.edu.ec'
        }
      ]

      const foundUser = users.find(u => u.username === username && u.password === password)
      
      if (foundUser) {
        this.user = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          name: foundUser.name,
          email: foundUser.email
        }
        this.isAuthenticated = true
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('isAuthenticated', 'true')
        
        return { success: true, user: this.user }
      } else {
        return { success: false, message: 'Credenciales incorrectas' }
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('isAuthenticated')
    },

    initializeAuth() {
      const savedUser = localStorage.getItem('user')
      const savedAuth = localStorage.getItem('isAuthenticated')
      
      if (savedUser && savedAuth === 'true') {
        this.user = JSON.parse(savedUser)
        this.isAuthenticated = true
      }
    }
  }
})
