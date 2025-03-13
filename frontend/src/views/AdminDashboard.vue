<template>
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>Dashboard - Administrator</h1>
        <button @click="logout" class="logout-btn">Logout</button>
      </header>
  
      <main class="dashboard-content">
        <div class="welcome-message">
          <h2>Welcome, {{ username }} !!!</h2>
          <router-link class="action-act" to="/Dashboard" style="text-decoration: none;">User Menu</router-link>
        </div>
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>Actions</h3>
            <button class="action-btn" @click="viewUserList">Show user list</button>
            <router-link class="action-btn" to="/setup_question" style="text-decoration: none;">Manage questions</router-link>
          </div>
        </div>

        <div v-if="showUserList" class="user-list">
          <h3>List of users</h3>
          <table>
            <thead>
              <tr>
                <th>User name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created on</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>{{ formatDate(user.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        isAdmin: false,
        showUserList: false,
        users: []
      };
    },
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      },
      async fetchUserData() {
        try {
          const token = this.getToken();
          if (!token) {
            this.$router.push('/login');
            return;
          }
          const response = await axios.get('/api/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.username = response.data.username;
          this.isAdmin = response.data.role === 'admin'; 
        } catch (error) {
          console.error('Error retrieving user data:', error.response?.data || error.message);
          this.handleAuthError(error);
        }
      },
      async viewUserList() {
        if (this.users.length > 0) {
          this.showUserList = true;
          return;
        }
        try {
          const token = this.getToken();
          const response = await axios.get('/api/users/users', {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.users = response.data.map(user => ({
            ...user,
            createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null
          }));
          this.showUserList = true;
        } catch (error) {
          console.error("Error retrieving user list:", error.response?.data || error.message);
          this.handleAuthError(error);
        }
      },
      formatDate(dateString) {
        if (!dateString) return 'Date not available';
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Invalid date';
          return date.toLocaleString('en-ZA', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });
        } catch (error) {
          console.error('Error while formatting date:', error);
          return 'Invalid date';
        }
      },
      getToken() {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return null;
        }
        return token;
      },
      handleAuthError(error) {
        if (error.response && error.response.status === 401) {
          console.error('Session expired or invalid token');
          this.logout();
        }
      }
    },
    mounted() {
      this.fetchUserData();
    }
  }
  </script>
  <style scoped>
  .dashboard {
    min-height: auto;
    height: auto;
  }
  
  .dashboard-header {
    color: black;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dashboard-header h1 {
    margin: 0;
  }
  
  .logout-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #c82333;
  }
  
  .dashboard-content {
    padding: 20px;
  }
  
  .welcome-message {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .dashboard-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .dashboard-card h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: x-large;
  }
  
  .action-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    margin-right: 10px;
    margin-bottom: 10px;
    transition: background-color 0.3s;
  }
  
  .action-btn:hover {
    background-color: #218838;
  }
  
  .action-act {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
  }
  
  .action-act:hover {
    background-color: #0069d9;
  }
  
  .profile-menu {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    margin-top: 10px;
  }
  
  .profile-menu input {
    display: block;
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    margin-left: 10px;
  }
  
  .cancel-btn:hover {
    background-color: #5a6268;
  }
  
  .action-btn {
    margin-right: 10px;
  }
  
  .update-message {
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
  }
  
  .update-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .update-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  </style>