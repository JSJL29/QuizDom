<template>
    <main class="main-content">
      <div class="nopassword-container">
        <h1>Reset Password</h1>
        <form v-if="!userFound" class="nopassword-form" @submit.prevent="checkEmail">
          <input v-model="email" type="email" placeholder="Enter your email address" required>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Verification...' : 'Confirm' }}
          </button>
        </form>
        <form v-else class="reset-password-form" @submit.prevent="resetPassword">
          <h2>Reset your Password</h2>
          <input v-model="newPassword" type="password" placeholder="New Password" required minlength="8">
          <input v-model="confirmPassword" type="password" placeholder="Confirm password" required>
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </form>
        <div v-if="message" class="success-message">{{ message }}</div>
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="back-to-login">
        <router-link to="/login">Back to login</router-link>
      </div>
      </div>
    </main>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        email: '',
        newPassword: '',
        confirmPassword: '',
        userFound: false,
        message: '',
        errorMessage: '',
        isLoading: false
      };
    },
    methods: {
      async checkEmail() {
        this.isLoading = true;
        this.errorMessage = '';
        this.message = '';
  
        try {
          const response = await axios.post('http://localhost:5000/api/auth/check-email', {
            email: this.email
          });
  
          if (response.status === 200) {
            this.userFound = true;
            this.message = response.data.message;
          }
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Error verifying email.';
        } finally {
          this.isLoading = false;
        }
      },
      async resetPassword() {
  
        this.isLoading = true;
        this.errorMessage = '';
        this.message = '';
  
        try {
          const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
            email: this.email,
            newPassword: this.newPassword
          });
  
          if (response.status === 200) {
            this.message = response.data.message;
            this.userFound = false;
            this.email = '';
            this.newPassword = '';
            this.confirmPassword = '';
          }
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Error resetting password.';
        } finally {
          this.isLoading = false;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f0f2f5;
  }
  
  .nopassword-container {
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 30px;
    width: 100%;
    max-width: 400px;
  }
  
  h1, h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .nopassword-form, .reset-password-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .submit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .submit-btn:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .submit-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .success-message {
    color: #28a745;
    text-align: center;
    margin-top: 15px;
  }
  
  .error-message {
    color: #dc3545;
    text-align: center;
    margin-top: 15px;
  }
  </style>