<template>
  <div>
    <h1>Generate quiz with AI</h1>
    <textarea v-model="categoryInput" placeholder="Enter a categorie" rows="2"></textarea>
    <button @click="generateQCM" :disabled="loading">Generate quiz</button>
    <router-link to="/setup_question" class="back-btn">Back</router-link>
    <div v-if="loading">Loading...</div>
    <h2>Generated questions</h2>
    <div v-if="questions.length">
      <div v-for="(question, index) in questions" :key="index" class="question">
        <h3>Question {{ index + 1 }}:</h3>
        <p><strong>Categorie:</strong> {{ question['categorie_id'] }}</p>
        <p><strong>Question:</strong> {{ question['content'] }}</p>
        <ul>
          <li><strong>A:</strong> {{ question['option_a'] }}</li>
          <li><strong>B:</strong> {{ question['option_b'] }}</li>
          <li><strong>C:</strong> {{ question['option_c'] }}</li>
          <li><strong>D:</strong> {{ question['option_d'] }}</li>
        </ul>
        <p><strong>Correct answer:</strong> {{ question['correctOption'] }}</p>
        <button @click="saveQuestion(question)">Save the question</button>
      </div>
    </div>
    <div v-if="rawResponse" class="raw-response">
      <h2>AI raw response</h2>
      <pre>{{ rawResponse }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      categoryInput: "",
      rawResponse: "",
      loading: false,
      apiKey: "PERPLEXITY_API_KEY", 
      baseUrl: "https://api.perplexity.ai",
      token: localStorage.getItem('token'),
      questions: {}, 
    };
  },
  methods: {
    getHeaders() {
      return {
        headers: { Authorization: `Bearer ${this.token}` }
      };
    },
    createHeaders() {
      return {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
    },
    async generateQCM() {
      if (!this.categoryInput.trim()) {
        alert("Veuillez entrer une catégorie.");
        return;
      }
      this.loading = true;
      try {
        const response = await axios.post(
          `${this.baseUrl}/chat/completions`,
          {
            model: "llama-3.1-sonar-large-128k-online",
            messages: [
              {
                role: "system",
                content:
                  `Generate 10 multiple-choice questions (MCQs) based on a specific category provided by the user. For each question, include the question text, 4 answer options (A, B, C, D), and indicate the correct answer. Don't add anymore than the exemple, nor add any "\n" more than the exemple Your answer have to follow this exemple : Question :{your_question} A:{your_answer_option_a} B:{your_answer_option_b} C:{your_answer_option_c} D:{your_answer_option_d} Correct Answer:{your_correct_answer_letter},`,
              },
              { role: "user", content: `Category: ${this.categoryInput}` },
            ],
          },
          { headers: this.createHeaders() }
        );
        
        const assistantResponse = response.data.choices[0]?.message?.content;
        
        if (assistantResponse) {
          this.rawResponse = assistantResponse;
          this.questions = this.parseQCMResponse(assistantResponse);
        } else {
          alert("Erreur : La réponse de l'IA est vide.");
        }
        
      } catch (error) {
        console.error("Erreur lors de la génération des QCM :", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        
      } finally {
        this.loading = false;
      }
    },
    
    parseQCMResponse(response) {
      try {        
        const questionBlocks = response.split("\n\n").filter((block) => block.includes("Question"));
        
        const generatedQuestions = questionBlocks.map((block) => {

          const category = this.categoryInput.trim() || "Non spécifié";
          
          const questionMatch = block.match(/Question \d+:\s*(.+)/);
          const content = questionMatch ? questionMatch[1].trim() : "Non spécifié";
          
          const optionsMatch = block.match(/A:\s*(.+)\nB:\s*(.+)\nC:\s*(.+)\nD:\s*(.+)/);
          const option_a = optionsMatch ? optionsMatch[1].trim() : "Non spécifié";
          const option_b = optionsMatch ? optionsMatch[2].trim() : "Non spécifié";
          const option_c = optionsMatch ? optionsMatch[3].trim() : "Non spécifié";
          const option_d = optionsMatch ? optionsMatch[4].trim() : "Non spécifié";
          
          const correctAnswerMatch = block.match(/Correct Answer:\s*([A-D])/);
          const correctOption = correctAnswerMatch ? correctAnswerMatch[1].trim().toLowerCase() : "Non spécifié";

          return { 
            categorie_id: category, 
            content, 
            option_a, 
            option_b, 
            option_c, 
            option_d, 
            correctOption 
          };
          
        });
        
        return generatedQuestions;
        
      } catch (error) {        
        console.error("Erreur lors du parsing de la réponse :", error);
        alert("Une erreur est survenue lors de la lecture des questions générées.");
        
      }
    },

    async saveQuestion(newQuestion) {
  try {
    let categoryId;
    const categoryTitle = encodeURIComponent(newQuestion.categorie_id);

    try {
      const categoryResponse = await axios.get(`/api/categories/id-by-title/${categoryTitle}`, this.getHeaders());
      if (categoryResponse.data && categoryResponse.data.id) {
        // If the category exists, use its ID
        categoryId = categoryResponse.data.id;
        console.log('Existing Category ID:', categoryId);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const createCategoryResponse = await axios.post('/api/categories', { title: categoryTitle }, this.getHeaders());
        categoryId = createCategoryResponse.data.id; 
        console.log('New Category Created with ID:', categoryId);
      } else {
        throw error;
      }
    }

    const correctOptionMap = {
      'a': 'option_a',
      'b': 'option_b',
      'c': 'option_c',
      'd': 'option_d'
    };

    const correctOptionKey = newQuestion.correctOption.toLowerCase();
    const correctOptionValue = correctOptionMap[correctOptionKey];

    if (!correctOptionValue) {
      throw new Error('Invalid correct option');
    }

    const questionData = {
      categorie_id: categoryId,
      content: newQuestion.content,
      option_a: newQuestion.option_a,
      option_b: newQuestion.option_b,
      option_c: newQuestion.option_c,
      option_d: newQuestion.option_d,
      correct_option: correctOptionValue
    };

    await axios.post('/api/questions', questionData, this.getHeaders());

    alert('La question a été enregistrée avec succès !');
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la question :", error);
    alert("Une erreur est survenue lors de l'enregistrement de la question.");
  } 

}}}
</script>
<style scoped>
div {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1, h2 {
  color: #333;
  text-align: center;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

button:hover {
  background-color: #45a049;
}

button[disabled] {
  background-color: #ccc;
}

.question {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.question h3 {
  margin-top: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.raw-response {
  margin-top: 20px;
  padding: 15px;
  border: 1px dashed #ccc;
  background-color: #f4f4f4;
}

pre {
  white-space: pre-wrap; 
}

.back-btn {
    background-color: #dc3545;
    color: white;
    text-decoration: none;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
  }

  button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 10px;
}
</style>