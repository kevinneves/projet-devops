const express = require('express');
const { Client } = require('pg'); // Importe le client PostgreSQL
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Servir les fichiers statiques du front-end
app.use(express.static(path.join(__dirname, 'public')));

// Configuration de la connexion à la base de données PostgreSQL
const client = new Client({
    user: 'user', // Correspond à POSTGRES_USER dans docker-compose.yml
    host: 'db', // Le nom du service Docker pour la base de données
    database: 'devops_db', // Correspond à POSTGRES_DB dans docker-compose.yml
    password: 'password', // Correspond à POSTGRES_PASSWORD dans docker-compose.yml
    port: 5432, // Le port par défaut de PostgreSQL
});

// Connexion à la base de données et création de la table si elle n'existe pas
client.connect()
    .then(() => {
        console.log('Connecté à la base de données PostgreSQL.');
        return client.query('CREATE TABLE IF NOT EXISTS users (email VARCHAR(255) PRIMARY KEY, password VARCHAR(255));');
    })
    .then(() => {
        console.log('Table "users" créée ou déjà existante.');
    })
    .catch(err => console.error('Erreur de connexion à la base de données', err.stack));

// Route d'inscription
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Email et mot de passe requis.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query('INSERT INTO users(email, password) VALUES($1, $2)', [email, hashedPassword]);
        res.status(201).send('Utilisateur enregistré avec succès !');
    } catch (err) {
        console.error(err.stack);
        res.status(500).send('Erreur lors de l\'enregistrement.');
    }
});

// Route de connexion
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    client.query('SELECT * FROM users WHERE email = $1', [email])
        .then(async result => {
            const user = result.rows[0];
            if (!user) {
                return res.status(401).send('Email ou mot de passe incorrect.');
            }
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(200).send('Connexion réussie !');
            } else {
                res.status(401).send('Email ou mot de passe incorrect.');
            }
        })
        .catch(err => {
            console.error(err.stack);
            res.status(500).send('Erreur serveur.');
        });
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});