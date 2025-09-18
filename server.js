const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Servir les fichiers statiques du front-end
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la base de données SQLite
// On change le schéma pour stocker les e-mails
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connecté à la base de données en mémoire.');
    // La table s'appelle maintenant "users" et a les colonnes "email" et "password"
    db.run('CREATE TABLE users(email TEXT, password TEXT)');
});

// Route d'inscription
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email et mot de passe requis.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users VALUES (?, ?)');
    stmt.run(email, hashedPassword, function(err) {
        if (err) {
            return res.status(500).send('Erreur lors de l\'enregistrement.');
        }
        res.status(201).send('Utilisateur enregistré avec succès !');
    });
    stmt.finalize();
});

// Route de connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // On recherche l'utilisateur par son e-mail
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
            return res.status(500).send('Erreur serveur.');
        }
        if (!row) {
            return res.status(401).send('Email ou mot de passe incorrect.');
        }
        const match = await bcrypt.compare(password, row.password);
        if (match) {
            res.status(200).send('Connexion réussie !');
        } else {
            res.status(401).send('Email ou mot de passe incorrect.');
        }
    });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});