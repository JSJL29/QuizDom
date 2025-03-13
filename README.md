# QuizDom

By Shang Jacky, Quinque Yann and Ia Antoine

## Project Overview

This project is a web application built with Node.js, Express, and Sequelize for managing users, categories, questions, and results. It provides APIs for user authentication, category management, question handling, and result tracking.

The application allows admin users to create, delete, and update categories and questions. All users can participate in quizzes based on their chosen categories. Admins can also generate new categories using AI and add them to the database.


## Technologies Used

- Node.js
- Express
- Axios
- Sequelize
- Dotenv


## Prerequisites 

### Create The Database :

```
    -- Users table
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Categories table
    CREATE TABLE categorie (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        creator_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );

    -- Questions table
    CREATE TABLE questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        categorie_id INT,
        content TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_option ENUM('option_a', 'option_b', 'option_c', 'option_d') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categorie_id) REFERENCES categorie(id)
    );

    -- Results table
    CREATE TABLE results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        categorie_id INT,
        score INT,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (categorie_id) REFERENCES categorie(id)
    );
```

## Module To Download

### Express.js

```

npm install express

```

### Axios

```

npm install axios

```

### Dotenv 

```

npm install dotenv

```

### Sequelize

```

npm install sequelize 

```

### Nodemon

```

npm install nodemon 

```

## Information To Know

### .env file 

It contains information about the database environment, change it to accord your own database environment.

```
# Server Configuration
DB_NAME= YOUR_DABASE_NAME
DB_USER= YOUR_DABASE_USER_NAME
DB_PASSWORD= YOUR_DABASE_PASSWORD
DB_HOST= YOUR_DABASE_HOST
DB_PORT= YOUR_DABASE_POST   
JWT_SECRET= YOUR_JWT_SECRET
```

### AI Questions Generation 

We used [Perplexity's](https://www.perplexity.ai/) API to allow admin to generate questions. 

Therefore the API keys is our own.

## .bat files

### runWeb.bat 

This files allow the user to run all the necccessary server commands to work on it: 
- Start the server
- Lauch the web server
- Open the localhost web page
- Open the project in VSCode

### runWeb.bat 

This files allow the user to run all the necccessary server commands for a presentation : 
- Start the server
- Lauch the web server
- Open the localhost web page