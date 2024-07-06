import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Todo from './src/models/todo.js';


const app = express();
app.use(cors());

const port = 5000;
app.use(express.json());

const mongoUrl = 'mongodb://localhost:27017/TodoList';
mongoose.connect(mongoUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.send('<div>Go to todos data <a href="http://localhost:5000/api/todos">here</a></div>');
});

app.post('/api/todos', async (req, res) => {
    const { desc, isCompleted, isStarred } = req.body;
    const newTodo = new Todo({ desc, isCompleted, isStarred });
    try {
        await newTodo.save();
    } catch (err) {
        console.error('Error saving todo:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
