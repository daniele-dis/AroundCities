const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database'); // Importa la connessione al database

const app = express();
const PORT = 5000;

app.use(cors()); // Abilita CORS per permettere al frontend di comunicare
app.use(express.json()); // Per parsare il body delle richieste JSON

// Endpoint di test
app.get('/', (req, res) => {
    res.send('Server backend avviato e funzionante!');
});

// --- Endpoint per la Registrazione Utente ---
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e password sono richiesti.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash della password
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
            if (err) {
                // Se l'email esiste già (UNIQUE constraint)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ message: 'Questa email è già registrata.' });
                }
                console.error('Errore durante la registrazione:', err.message);
                return res.status(500).json({ message: 'Errore interno del server durante la registrazione.' });
            }
            res.status(201).json({ message: 'Registrazione avvenuta con successo!', userId: this.lastID });
        });
    } catch (error) {
        console.error('Errore hashing password:', error);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
});

// --- Endpoint per il Login Utente ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e password sono richiesti.' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            console.error('Errore durante il login:', err.message);
            return res.status(500).json({ message: 'Errore interno del server.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Email o password non validi.' });
        }

        try {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email o password non validi.' });
            }
            // In una vera app, qui genereresti un token JWT. Per ora, restituiamo solo l'ID utente.
            res.status(200).json({ message: 'Login avvenuto con successo!', userId: user.id, email: user.email });
        } catch (error) {
            console.error('Errore durante il confronto password:', error);
            res.status(500).json({ message: 'Errore interno del server.' });
        }
    });
});

// --- Endpoint per Aggiungere una Visita ad una Città ---
app.post('/city-visits', (req, res) => {
    const { user_id, city_name, date_visited, notes } = req.body;

    if (!user_id || !city_name || !date_visited) {
        return res.status(400).json({ message: 'ID Utente, nome città e data di visita sono richiesti.' });
    }

    db.run('INSERT INTO city_visits (user_id, city_name, date_visited, notes) VALUES (?, ?, ?, ?)',
        [user_id, city_name, date_visited, notes], function(err) {
        if (err) {
            console.error('Errore durante l\'aggiunta della visita:', err.message);
            return res.status(500).json({ message: 'Errore interno del server.' });
        }
        res.status(201).json({ message: 'Visita alla città aggiunta con successo!', visitId: this.lastID });
    });
});

// --- Endpoint per Ottenere le Visite di un Utente ---
app.get('/city-visits/:userId', (req, res) => {
    const userId = req.params.userId;

    db.all('SELECT * FROM city_visits WHERE user_id = ?', [userId], (err, rows) => {
        if (err) {
            console.error('Errore durante il recupero delle visite:', err.message);
            return res.status(500).json({ message: 'Errore interno del server.' });
        }
        res.status(200).json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server backend avviato su http://localhost:${PORT}`);
});