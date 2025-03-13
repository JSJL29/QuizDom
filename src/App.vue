<template>
  <nav>
    <header class="main-header">
    <div class="logo">
      <router-link to="/" style="text-decoration: none;">QuizDom</router-link>
    </div>
    </header>
  </nav>
  <router-view></router-view>
</template>

<script>
export default {
  name: "App",
}
</script>

<style scoped>
.logo {
  font-size: 1.5em;
  font-weight: bold;
}

.main-header {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 24px;
  padding: 20px;
  margin-top: 20px; 
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>