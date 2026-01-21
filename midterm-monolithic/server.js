const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

// Database
const db = new sqlite3.Database('./students.db', (err) => {
    if (err) console.error(err);
    else console.log('Connected to SQLite');
});

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_code TEXT,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    major TEXT
)
`);

// GET all students
app.get('/api/students', (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// GET student by id
app.get('/api/students/:id', (req, res) => {
    db.get('SELECT * FROM students WHERE id=?', [req.params.id], (err, row) => {
        if (!row) return res.status(404).json({ error: 'Student not found' });
        res.json(row);
    });
});

// POST create student
app.post('/api/students', (req, res) => {
    const { student_code, first_name, last_name, email, major } = req.body;

    db.run(
        'INSERT INTO students(student_code, first_name, last_name, email, major) VALUES(?,?,?,?,?)',
        [student_code, first_name, last_name, email, major],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            db.get('SELECT * FROM students WHERE id=?', [this.lastID], (err, row) => {
                res.status(201).json(row);
            });
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log('Monolithic Server running on http://localhost:3000');
});
