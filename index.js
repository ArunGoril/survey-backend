const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

const mongoURI = 'mongodb://localhost:27017/quizDB'; 
mongoose.connect(mongoURI, options).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const Quiz = mongoose.model('Quiz', quizSchema);

app.use(bodyParser.json());

// API endpoint to fetch quiz data
app.get('/api/quiz', async (req, res) => {
  try {
    const quizData = await Quiz.find();

    res.json(quizData);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to add quiz data
app.post('/api/quiz', async (req, res) => {
  try {
    const { question, options, answer } = req.body;

    if (!question || !options || !answer) {
      return res.status(400).json({ error: 'Please provide question, options, and answer' });
    }

    const newQuiz = new Quiz({
      question,
      options,
      answer,
    });

    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const port = 9002; 
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
