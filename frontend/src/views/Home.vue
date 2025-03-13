<template>
  <main class="main-content">
    <div class="home-container">
      <h1>Welcome to QuizDom</h1>
      <p>Where your brain checks in, but your ego might check out!</p>
      <div class="button-group">
        <router-link to="/login" class="btn primary-btn">Login</router-link>
        <router-link to="/register" class="btn secondary-btn">Create an account</router-link>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.header {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
}

.main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.1);
  padding: 100px;
  text-align: center;
}

h1 {
  color: #333;
}

p {
  color: #555;
}

.button-group {
  margin-top: 30px;
}

.btn {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.1em;
}

.primary-btn {
  margin: 10px;
  background-color: #007bff;
  color: white;
}

.primary-btn:hover {
  background-color: #0056b3;
}

.secondary-btn {
  background-color: #28a745;
  color: white;
}

.secondary-btn:hover {
  background-color: #218838;
}

@media (max-width:768px) {
   .home-container {
     width: 90%;
     padding: 20px;
   }

   .btn {
     width: 100%;
     margin-bottom: 10px;
   }
}
</style>