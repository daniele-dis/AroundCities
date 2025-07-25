const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Percorso al file del database. Assicurati che sia nella stessa directory di database.js e server.js
const DB_PATH = path.join(__dirname, 'aroundcities.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Errore durante la connessione al database:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Errore durante la creazione della tabella users:', err.message);
            } else {
                console.log('Tabella users creata o già esistente.');
            }
        });

        db.run(`CREATE TABLE IF NOT EXISTS city_visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            city_name TEXT NOT NULL,
            date_visited TEXT NOT NULL,
            notes TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`, (err) => {
            if (err) {
                console.error('Errore durante la creazione della tabella city_visits:', err.message);
            } else {
                console.log('Tabella city_visits creata o già esistente.');
            }
        });
    }
});

module.exports = db;