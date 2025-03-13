<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="logout" class="logout-btn">Logout</button>
    </header>

    <main class="dashboard-content">
      <div class="welcome-message">
        <h2>Welcome, {{ username }} !</h2>
        <router-link v-if="isAdmin" to="/admin_dashboard" class="action-act" style="text-decoration: none;">Admin Menu</router-link>
      </div>
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Actions</h3>
          <button @click="toggleProfileMenu" class="action-btn">Edit profile</button>

          <router-link class="action-btn" to="/playground" style="text-decoration: none;">Play</router-link>

          <router-link class="action-btn" to="/view_results" style="text-decoration: none;">See my results</router-link>
          
          <div v-if="showProfileMenu" class="profile-menu">
            <input v-model="newUsername" placeholder="New username" />
            <input v-model="newPassword" type="password" placeholder="New Password" />
            <input v-model="newEmail" type="email" placeholder="New email address" />
            <button @click="updateProfile" class="action-btn">Save</button>
            <button @click="toggleProfileMenu" class="action-btn cancel-btn">Cancel</button>
            <p v-if="updateMessage" :class="['update-message', updateMessage.type]">{{ updateMessage.text }}</p>
          </div>
        </div>
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
      showProfileMenu: false,
      newUsername: '',
      newPassword: '',
      newEmail: '',
      updateMessage: null
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    async fetchUserData() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        const response = await axios.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.username = response.data.username;
        if (response.data.admin == "admin"){
          this.isAdmin = true;
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
        this.$router.push('/login');
      }
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    async updateProfile() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put('/api/users/update', {
          username: this.newUsername,
          password: this.newPassword,
          email: this.newEmail
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          this.username = this.newUsername || this.username;
          this.newUsername = '';
          this.newPassword = '';
          this.newEmail = '';
          this.updateMessage = { type: 'success', text: 'Profile updated successfully!' };
          setTimeout(() => {
            this.updateMessage = null;
            this.showProfileMenu = false;
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.updateMessage = { type: 'error', text: 'Error updating profile. Please try again.' };
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