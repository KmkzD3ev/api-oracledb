const express = require('express');
const app = express();
const executeQuery = require('./api/execute-query'); // Importa a API

app.get('/api/execute-query', executeQuery);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
