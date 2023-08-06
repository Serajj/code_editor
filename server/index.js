// server.js
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const editorRoutes = require('./routes/editor');

const cors = require('cors');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
//cors
app.use(cors());
app.use(express.json()); // Add this line to parse incoming JSON data

// Connect to MongoDB
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', authRoutes);
// editor
app.use('/api/editor',editorRoutes );
//authenticated routes
app.use('/api/questions',authMiddleware,questionRoutes);


app.get('/', (req,res)=>{
    res.send("Welcome to the server...");
});
// Start the server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
