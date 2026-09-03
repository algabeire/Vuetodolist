const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Creates a local database named 'todo_db')
mongoose.connect('mongodb://127.0.0.1:27017/todo_db')
  .then(() => console.log('🚀 Connected successfully to MongoDB!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const Todo = mongoose.model('Todo', todoSchema);

// --- API ROUTES ---

// 1. Get all todos from the database
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    console.log(`📥 Fetched ${todos.length} todos from the database.`);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Add a new todo item
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ title: req.body.title });
    await newTodo.save();
    console.log(`📝 New Todo Added: "${newTodo.title}"`);
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Delete a todo item by its MongoDB ID
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    console.log(`🗑️ Todo Deleted: "${deletedTodo?.title || req.params.id}"`);
    res.json({ message: 'Todo deleted successfully!' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start listening on the configured port (use PORT env var to override)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server is active on http://localhost:${PORT}`));
