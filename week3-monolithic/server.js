const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./database/tasks.db');

// GET all tasks
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ tasks: rows });
        }
    });
});

// POST create task
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    db.run(
        'INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)',
        [title, description, priority],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});