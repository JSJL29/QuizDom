<template>
  <main class="main-content">
    <div class="login-container">
      <h1>Connexion</h1>
      <form class="login-form" @submit.prevent="login">
        <input v-model="username" type="text" placeholder="User name" required>
        <input v-model="password" type="password" placeholder="Password" required>
        <button type="submit" class="submit-btn">Login</button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="forgot-password">
        <router-link to="/no_password">Forgot your password?</router-link>
      </div>
      <div class="create-account">
        <router-link to="/register" class="create-account-link">Create an account</router-link>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      this.errorMessage = '';
      if (!this.username || !this.password) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username: this.username,
          password: this.password
        });

        const token = response.data.token;
        localStorage.setItem('token', token);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Connection error:', error);
        if (error.response) {
          this.errorMessage = error.response.data.message || "Connection error. Please try again.";
        } else if (error.request) {
          this.errorMessage = "No response from the server. Please try again later.";
        } else {
          this.errorMessage = "An error has occurred. Please try again.";
        }
      }
    }
  }
}
</script>

<style scoped>

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 90%;
  max-width: 400px;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1em;
}

.submit-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.forgot-password {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 15px;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.create-account {
  text-align: center;
  margin-top: 20px;
}

.create-account-link {
  display: inline-block;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 1em;
  transition: background-color 0.3s;
}

.create-account-link:hover {
  background-color: #218838;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}
</style>