<template>
    <div class="play-quiz">
      <header class="quiz-header">
        <h1>Play Quiz</h1>
        <router-link to="/dashboard" class="back-btn">Back</router-link>
      </header>
  
      <main class="quiz-content">
        <div v-if="!selectedCategory" class="category-selection">
          <h2>Choose a category</h2>
          <div class="categories-grid">
            <div v-for="category in categories" 
                 :key="category.id" 
                 class="category-card"
                 @click="selectCategory(category)">
              <h3>{{ category.title }}</h3>
              <button class="play-btn">Play</button>
            </div>
          </div>
        </div>

        <div v-else class="quiz-game">
          <div class="quiz-info">
            <h2>{{ selectedCategory.title }}</h2>
            <p>Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}</p>
          </div>
  
          <div v-if="!quizCompleted" class="question-container">
            <div class="question">
              <h3>{{ currentQuestion.content }}</h3>
              <div class="options">
                <button v-for="option in ['option_a', 'option_b', 'option_c', 'option_d']"
                        :key="option"
                        class="option-btn"
                        :class="{ selected: selectedAnswer === option }"
                        @click="selectAnswer(option)">
                  {{ currentQuestion[option] }}
                </button>
              </div>
            </div>
            <button class="submit-btn" 
                    @click="submitAnswer"
                    :disabled="!selectedAnswer">
              {{ isLastQuestion ? 'Terminer' : 'Suivant' }}
            </button>
          </div>
  
          <!-- Résultats -->
          <div v-else class="results">
            <h2>Quiz over!</h2>
            <p class="score">Score: {{ score }} / {{ questions.length }}</p>
            
            <div class="answers-summary">
              <h3>Summary</h3>
              <div v-for="(answer, index) in userAnswers" :key="index" class="answer-item">
                <p><strong>Question:</strong> {{ answer.question }}</p>
                <p><strong>Your answer:</strong> {{ answer.selectedAnswer }}</p>
                <p><strong>Correct answer:</strong> {{ answer.correctAnswer }}</p>
              </div>
            </div>
            
            <button class="restart-btn" @click="restartQuiz">Replay</button>
            <button class="home-btn" @click="goHome">Back to home</button>
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
        categories: [],
        selectedCategory: null,
        questions: [],
        currentQuestionIndex: 0,
        selectedAnswer: null,
        score: 0,
        quizCompleted: false,
        userAnswers: [], // Nouveau tableau pour suivre les réponses utilisateur
        token: localStorage.getItem('token')
      };
    },
  
    computed: {
      currentQuestion() {
        return this.questions[this.currentQuestionIndex] || {};
      },
      isLastQuestion() {
        return this.currentQuestionIndex === this.questions.length - 1;
      }
    },
  
    methods: {
      getHeaders() {
        return {
          headers: { Authorization: `Bearer ${this.token}` }
        };
      },
  
      async fetchCategories() {
        try {
          const response = await axios.get('/api/categories', this.getHeaders());
          this.categories = response.data;
        } catch (error) {
          console.error('Error retrieving categories:', error);
        }
      },
  
      async selectCategory(category) {
        this.selectedCategory = category;
        try {
          const response = await axios.get(`/api/questions/category/${category.id}`, this.getHeaders());
          this.questions = response.data.map(question => ({
            id: question.id,
            content: question.content,
            categorie_id: question.categorie_id,
            option_a: question.option_a,
            option_b: question.option_b,
            option_c: question.option_c,
            option_d: question.option_d,
            correct_option: question.correct_option
          }));
          this.resetQuiz();
        } catch (error) {
          console.error('Error retrieving questions:', error);
        }
      },
  
      selectAnswer(option) {
        this.selectedAnswer = option;
      },
  
      async submitAnswer() {
      // Save the user's answer with the corresponding text
      this.userAnswers.push({
        question: this.currentQuestion.content,
        selectedAnswer: this.currentQuestion[this.selectedAnswer], // Text of the selected answer
        correctAnswer: this.currentQuestion[this.currentQuestion.correct_option] // Text of the correct answer
      });

      // Check if the selected answer is correct
      if (this.selectedAnswer === this.currentQuestion.correct_option) {
        this.score++;
      }

      // Move to the next question or finish the quiz
      if (this.isLastQuestion) {
        await this.saveResult();
        this.quizCompleted = true;
      } else {
        this.currentQuestionIndex++;
        this.selectedAnswer = null;
      }
      },  
      async saveResult() {
        try {
          await axios.post('/api/results', {
            categorie_id: this.selectedCategory.id,
            score: this.score
          }, this.getHeaders());
        } catch (error) {
          console.error('Error saving result:', error);
        }
      },
  
      resetQuiz() {
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.score = 0;
        this.quizCompleted = false;
        this.userAnswers = []; // Réinitialiser les réponses utilisateur
      },
  
      restartQuiz() {
        this.resetQuiz();
      },
  
      goHome() {
        this.$router.push('/dashboard');
      }
    },
  
    mounted() {
      if (!this.token) {
        this.$router.push('/login');
        return;
      }
      this.fetchCategories();
    }
  };
  </script>
  
  
  <style scoped>
body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

  .play-quiz {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .quiz-header {
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
  
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .category-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .category-card:hover {
    transform: translateY(-5px);
  }
  
  .play-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
  }
  
  .question-container {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .options {
    display: grid;
    gap: 10px;
    margin: 20px 0;
  }
  
  .option-btn {
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }
  
  .option-btn.selected {
    border-color: #007bff;
    background-color: #e7f1ff;
  }
  
  .submit-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    margin-top: 20px;
  }
  
  .submit-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .results {
    text-align: center;
    padding: 20px;
  }
  
  .score {
    font-size: 24px;
    margin: 20px 0;
  }
  
  .restart-btn, .home-btn {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .restart-btn {
    background-color: #28a745;
    color: white;
  }
  
  .home-btn {
    background-color: #6c757d;
    color: white;
  }

  .answers-summary {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.answer-item {
  margin-bottom: 15px;
}

.answer-item p {
  margin: 5px 0;
}
  </style>
