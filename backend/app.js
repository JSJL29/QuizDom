const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const categorieRoutes = require('./routes/categories');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/user');
const resultRoutes = require('./routes/results');
const app = express();

app.use(cors());
app.use(express.json());

// Utilisez vos routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;