const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Il percorso del database è nella stessa cartella dello script
const dbPath = path.join(__dirname, 'aroundcities.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Errore durante la connessione:', err.message);
    } else {
        console.log('Connesso al database aroundcities.db.');
        
        // Esegui la query per eliminare gli utenti
        db.run(
            "DELETE FROM user WHERE name IN (?, ?)",
            ['DanyDis', 'CiroLaRocca'],
            function(err) {
                if (err) {
                    console.error('Errore durante la cancellazione:', err.message);
                } else {
                    console.log(`Eliminati ${this.changes} utenti.`);
                }
                
                // Chiudi la connessione al database
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Errore nella chiusura del database:', closeErr.message);
                    } else {
                        console.log('Connessione al database chiusa.');
                    }
                });
            }
        );
    }
});