const express = require('express');
const app = express();
const executeQuery = require('./api/execute-query'); // Importa a API

// Rota principal para verificar se a API está rodando
app.get('/', (req, res) => {
    res.send('API está rodando! Acesse <a href="/api/execute-query">/api/execute-query</a> para consultar os dados.');
});

// Rota da API para executar a consulta
app.get('/api/execute-query', executeQuery);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
