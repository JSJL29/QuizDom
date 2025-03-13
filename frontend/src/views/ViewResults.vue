<template>
    <div class="results-view">
      <header class="results-header">
        <h1>My results</h1>
        <router-link to="/dashboard" class="back-btn">Back</router-link>
      </header>
  
      <main class="results-content">
        <div class="results-grid">
          <!-- Liste des résultats -->
          <div v-if="userResults.length > 0" class="results-list">
            <div v-for="result in userResults" :key="result.id" class="result-card">
              <div class="result-header">
                <h3>{{ result.categorie.title }}</h3>
                <span class="score-badge">Score: {{ result.score }}/5</span>
              </div>
              <p class="completion-date">Completed on: {{ formatDate(result.completed_at) }}</p>
            </div>
          </div>
          <div v-else class="no-results">
            <p>You haven't taken a quiz yet.</p>
            <router-link to="/playground" class="play-btn">Start a quiz</router-link>
          </div>
        </div>
  
        <!-- Modal des détails -->
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <h2>Quiz Details</h2>
            <div v-for="question in selectedResult.questions" :key="question.id" class="question-detail">
              <p class="question-text">{{ question.content }}</p>
              <div class="options-list">
                <div v-for="option in ['option_a', 'option_b', 'option_c', 'option_d']" 
                     :key="option"
                     :class="['option', {
                       'correct': option === question.correct_option,
                       'incorrect': selectedResult.userAnswers[question.id] === option && 
                                  option !== question.correct_option
                     }]">
                  {{ question[option] }}
                  <span v-if="option === question.correct_option" class="correct-mark">✓</span>
                  <span v-if="selectedResult.userAnswers[question.id] === option && 
                            option !== question.correct_option" 
                        class="incorrect-mark">✗</span>
                </div>
              </div>
            </div>
            <button @click="closeModal" class="close-btn">Close</button>
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
        userResults: [],
        showModal: false,
        selectedResult: null,
        token: localStorage.getItem('token')
      };
    },
  
    methods: {
      getHeaders() {
        return {
          headers: { Authorization: `Bearer ${this.token}` }
        };
      },
  
      async fetchUserResults() {
        try {
          const response = await axios.get('/api/results/user', this.getHeaders());
          this.userResults = response.data;
        } catch (error) {
          console.error('Error retrieving results:', error);
        }
      },
  
      closeModal() {
        this.showModal = false;
        this.selectedResult = null;
      },
  
      formatDate(dateString) {
        return new Date(dateString).toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    },
  
    mounted() {
      if (!this.token) {
        this.$router.push('/login');
        return;
      }
      this.fetchUserResults();
    }
  };
  </script>
  
  <style scoped>
  .results-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  .back-btn {
    background-color: #dc3545;
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 5px;
  }
  
  .results-grid {
    display: grid;
    gap: 20px;
  }
  
  .result-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .score-badge {
    background-color: #28a745;
    color: white;
    padding: 5px 10px;
    border-radius: 20px;
  }
  
  .completion-date {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 15px;
  }
  
  .detail-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    max-width: 80%;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .question-detail {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .option {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .option.correct {
    background-color: #d4edda;
    border-color: #c3e6cb;
  }
  
  .option.incorrect {
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
  
  .correct-mark {
    color: #28a745;
    font-weight: bold;
  }
  
  .incorrect-mark {
    color: #dc3545;
    font-weight: bold;
  }
  
  .close-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
  }
  
  .no-results {
    text-align: center;
    padding: 40px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .play-btn {
    background-color: #28a745;
    color: white;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 5px;
    display: inline-block;
    margin-top: 15px;
  }
  </style>