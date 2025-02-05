const express = require('express');
const app = express();
const executeQuery = require('./api/execute-query'); 


app.get('/', (req, res) => {
    res.send('🚀 API está rodando! Acesse <a href="/api/execute-query">/api/execute-query</a> para consultar os dados.');
});

// ✅ Rota correta da API
app.get('/api/execute-query', async (req, res) => {
    try {
        const result = await executeQuery(req, res);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao executar a consulta' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
