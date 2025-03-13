import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import NoPassword from '../views/NoPassword.vue';
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import SetupQuestion from '../views/SetupQuestion.vue';
import Playground from '../views/Playground.vue';
import ViewResults from '../views/ViewResults.vue';
import GenerateQuestion from '../views/GenerateQuestions.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path:"/",
      name: "Home",
      component: Home,
    },
    { 
      path:"/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
    },
    {
      path: "/no_password",
      name: "NoPassword",
      component: NoPassword,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/admin_dashboard",
      name: "AdminDashboard",
      component: AdminDashboard,
    },
    {
      path: "/setup_question",
      name: "SetupQuestion",
      component: SetupQuestion,
    },
    {
      path: "/playground",
      name: "Playground",
      component: Playground,
    },
    {
      path: "/view_results",
      name: "View Results",
      component: ViewResults,
    },
    {
      path: "/generate_questions",
      name: "Generate Questions",
      component: GenerateQuestion,
    }
  ]
})

export default router
