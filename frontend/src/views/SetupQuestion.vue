<template>
  <div class="setup-quiz-questions">
    <h2>Paramétrer Questions</h2>
    <div class="choice-buttons">
      <button @click="currentView = 'categories'" :class="{ active: currentView === 'categories' }">Manage Categories</button>
      <button @click="currentView = 'questions'" :class="{ active: currentView === 'questions' }">Manage Questions</button>
      <router-link to="/generate_questions" class="link-button">Generate questions</router-link>
      <router-link to="/admin_dashboard" class="back-btn">Back</router-link>
    </div>

    <!-- Category Management -->
    <form v-if="currentView === 'categories'" @submit.prevent="createCategorie">
      <h3>Create a new Category</h3>
      <div class="form-group">
        <label for="title">Category Title:</label>
        <input id="title" v-model="newCategorie.title" required>
      </div>
      <button type="submit">Create Category</button>
      <div class="categories-list">
        <h3>Existing categories</h3>
        <ul>
          <li v-for="categorie in categories" :key="categorie.id">
            {{ categorie.title }}
            <!-- Delete Button -->
            <button @click.prevent="confirmDelete(categorie.id)" class="delete-btn">Delete</button>
          </li>
        </ul>
      </div>
    </form>

    <!-- Question Management -->
    <form v-if="currentView === 'questions'" @submit.prevent="isEditing ? updateQuestion() : createQuestion()">
      <h3>{{ isEditing ? 'Update Question' : 'Create a new Question' }}</h3>
      <div class="form-group">
        <label for="categorie">Category :</label>
        <select id="categorie" v-model="newQuestion.categorie_id" required>
          <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">
            {{ categorie.title }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label for="content">Question :</label>
        <textarea id="content" v-model="newQuestion.content" required></textarea>
      </div>

      <!-- Options -->
      <div class="form-group" v-for="option in ['a', 'b', 'c', 'd']" :key="'option_' + option">
        <label :for="'option_' + option">Option {{ option.toUpperCase() }} :</label>
        <input :id="'option_' + option" v-model="newQuestion['option_' + option]" required />
      </div>

      <!-- Correct Option -->
      <div class="form-group">
        <label for="correct_option">Correct answer:</label>
        <select id="correct_option" v-model="newQuestion.correct_option" required>
          <option value="option_a">Option A</option>
          <option value="option_b">Option B</option>
          <option value="option_c">Option C</option>
          <option value="option_d">Option D</option>
        </select>
      </div>

      <!-- Submit Button -->
      <button type="submit">{{ isEditing ? 'Update Question' : 'Create the Question' }}</button>

      <!-- Existing Questions List Sorted by Selected Category -->
      <div class="questions-list">
        <h3>Existing questions</h3>
        <!-- Dropdown to select category for sorting -->
        <select v-model="selectedCategoryId" @change="sortQuestionsByCategory">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="'cat_' + category.id" :value="category.id">{{ category.title }}</option>
        </select>

        <!-- Display sorted questions -->
        <ul>
          <li v-for="question in sortedQuestions" :key="'question_' + question.id">
            {{ question.content }}
            <!-- Edit and Delete Buttons -->
            <button @click.prevent="editQuestion(question)" class="edit-btn">Edit</button>
            <button @click.prevent="deleteQuestion(question.id)" class="delete-btn">Delete</button>
          </li>
        </ul>
      </div>

    </form>

  </div>
</template>

<script>
// Import axios for HTTP requests
import axios from 'axios';

export default {
  data() {
    return {
      currentView: 'categories',
      categories: [],
      questions: [],
      newCategorie: { title: '' },
      newQuestion: { id: null, categorie_id: '', content: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: '' },
      isEditing: false,
      selectedCategoryId: null, // New property for selected category
      token: localStorage.getItem('token')
    };
  },
  computed: {
    sortedQuestions() {
      if (this.selectedCategoryId) {
        return this.questions.filter(question => question.categorie_id === this.selectedCategoryId);
      }
      return this.questions;
    }
  },
  methods: {
    getHeaders() {
      return { headers: { Authorization: `Bearer ${this.token}` } };
    },
    async createCategorie() {
      try {
        const response = await axios.post('/api/categories', this.newCategorie, this.getHeaders());
        this.categories.push(response.data.categorie);
        this.newCategorie.title = '';
        this.fetchCategories();
      } catch (error) {
        console.error('Error creating category:', error);
      }
    },
    async createQuestion() {
      try {
        const response = await axios.post('/api/questions', this.newQuestion, this.getHeaders());
        this.questions.push(response.data.question);
        this.resetQuestionForm();
        this.fetchQuestions();
      } catch (error) {
        console.error('Error creating question:', error);
      }
    },
    async updateQuestion() {
      try {
        await axios.put(`/api/questions/${this.newQuestion.id}`, this.newQuestion, this.getHeaders());
        this.resetQuestionForm();
        this.fetchQuestions();
        this.isEditing = false;
      } catch (error) {
        console.error('Error updating question:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('/api/categories', this.getHeaders());
        this.categories = response.data;
      } catch (error) {
        console.error('Error retrieving categories:', error);
      }
    },
    async fetchQuestions() {
      try {
        const response = await axios.get('/api/questions/all', this.getHeaders());
        this.questions = response.data;
        
        // Sort questions if a category is already selected
        if (this.selectedCategoryId) {
          this.sortQuestionsByCategory();
        }
        
      } catch (error) {
        console.error('Error retrieving questions:', error);
      }
    },
    async deleteCategorie(id) {
      try {
        await axios.delete(`/api/categories/${id}`, this.getHeaders());
        this.categories = this.categories.filter(c => c.id !== id);
        
         // Update questions list after deleting a category
         if (this.selectedCategoryId === id) {
           this.selectedCategoryId = null; // Reset selection if deleted
         }
         
         // Re-fetch categories and questions
         await Promise.all([this.fetchCategories(), this.fetchQuestions()]);
         
       } catch (error) {
         console.error('Error deleting category:', error);
       }
     },
     confirmDelete(id) {
       if (confirm("Are you sure you want to delete this category?")) {
         this.deleteCategorie(id);
       }
     },
     async deleteQuestion(id) {
       try {
         await axios.delete(`/api/questions/${id}`, this.getHeaders());
         this.questions = this.questions.filter(q => q.id !== id);
       } catch (error) {
         console.error('Error deleting question:', error);
       }
     },
     editQuestion(question) {
       Object.assign(this.newQuestion, question);
       this.isEditing = true;
     },
     resetQuestionForm() {
       this.newQuestion = { id: null, categorie_id: '', content: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: '' };
       this.isEditing = false;
     },
     sortQuestionsByCategory() { 
       // This method is triggered by the change event on the category dropdown
       // The computed property `sortedQuestions` will automatically update based on `selectedCategoryId`
     }
   },
   mounted() { 
     if (this.token) { 
       Promise.all([this.fetchCategories(), this.fetchQuestions()]);
     } else { 
       console.error("Token not found. Please login."); 
       this.$router.push('/login'); 
     } 
   }
};
</script>

<style scoped>
.back-btn {
    background-color: #dc3545;
    color: white;
    text-decoration: none;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
  }

.link-button{
  background-color: #45a049;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  text-decoration: none;
  margin-right: 10px;
}

.setup-quiz-questions {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.choice-buttons {
  margin-bottom: 20px;
}
.choice-buttons button {
  margin-right: 10px;
}
.choice-buttons button.active {
  background-color: #45a049;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input[type='text'],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
}
button:hover {
  background-color: #45a049;
}
.option-group {
  margin-bottom: 10px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}
</style>
