<template>
  <main class="main-content">
    <div class="login-container">
      <h1>Inscription</h1>
      <form class="login-form" @submit.prevent="register">
        <input v-model="username" type="text" placeholder="Nom d'utilisateur" required>
        <input v-model="email" type="email" placeholder="Email" required>
        <input v-model="password" type="password" placeholder="Mot de passe" required>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Registration in progress...' : 'Register' }}
        </button>
      </form>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div class="forgot-password">
        <router-link to="/login" class="create-account-link">Already have an account? Log in</router-link>
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
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async register() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });

        if (response.status === 201) {
          alert('Registration successful! You can now log in.');
          this.$router.push('/login');
        }
      } catch (error) {
        console.error('Complete error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Statut:', error.response.status);
          this.errorMessage = error.response.data.message || 'Error while registering. Please try again.';
        } else if (error.request) {
          console.error('No response received:', error.request);
          this.errorMessage = 'No response from the server. Please try again later.';
        } else {
          console.error('Query configuration error:', error.message);
          this.errorMessage = 'Connection error. Please try again later.';
        }
      } finally {
        this.isLoading = false;
      }
    },
    validateForm() {
      if (this.username.length < 3) {
        this.errorMessage = 'Username must contain at least 3 characters.';
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.errorMessage = 'Please enter a valid email address.';
        return false;
      }
      if (this.password.length < 6) {
        this.errorMessage = 'Password must contain at least 6 characters.';
        return false;
      }
      return true;
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
  border:1px solid #ddd ;
 border-radius :5px ;
font-size :1em ;
}
.submit-btn{
background-color:#007bff ;
color:white ;
border:none ;
border-radius :5px ;
padding :12px ;
font-size :1.1em ;
cursor:pointer ;
transition :background-color .3s ;
}
.submit-btn:hover{
background-color:#0056b3 ;
}
.forgot-password{
text-align:center ;
margin-top :20px ;
}
.forgot-password a{
color:#007bff ;
text-decoration:none ;
}
.forgot-password a:hover{
text-decoration :underline ;
}

.create-account-link {
    display:inline-block ;
    background-color:#28a745 ;
    color:white ;
    text-decoration:none ;
    padding :10px15px ;
    border-radius :5px ;
font-size :1em ;
transition :background-color .3s ;
}

.create-account-link:hover{
background-color:#218838 ;
}

.forgot-password{
margin-bottom :15px ;
}

.error-message{
color:red ;
text-align:center ;
margin-top :10px ;
}

</style>