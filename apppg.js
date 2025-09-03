const express = require('express');
const { Pool } = require('pg'); // Changed from MongoClient to pg Pool
const server = express();
const { readFile } = require('fs').promises;
const ejs = require('ejs');

require('dotenv').config();

const port = 8080;
// PostgreSQL connection pool for Neon
const pool = new Pool({
    connectionString: process.env.NEON_URI,
    ssl: {
        rejectUnauthorized: false
    }
});
const dataBaseName = "recipe_site";
const collectionName = "recipes";

server.set('view engine', 'ejs');

server.use(express.static('public'));

server.get('/', async (request, response) => {
    response.send(await readFile('./index.html', 'utf8'));
});

server.get('/receitas*', async (request, response) => {
    const name = request.path.split("/").pop();
    upperName = name.charAt(0).toUpperCase() + name.slice(1);

    try {
        // PostgreSQL query instead of MongoDB
        const result = await pool.query(
            'SELECT * FROM recipes WHERE nome = $1',
            [upperName]
        );

        if (result.rows.length === 0) {
            response.status(404).send(await readFile('./404.html', 'utf8'));
            return;
        }

        data = result.rows[0];
        data.imagem = "data:image/svg+xml;base64, " + data.imagem.toString('base64');
        response.render('recipe', data);
    } catch (err) {
        console.error('Database error:', err);
        response.status(500).send('Internal server error');
    }
});

server.use(async (request, response) => {
    response.status(404).send(await readFile('./404.html', 'utf8'));
});

server.listen(process.env.PORT || port, () => console.log(`App available on http://localhost:${port}`));

