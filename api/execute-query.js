const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    let connection;
    try { 
        connection = await oracledb.getConnection(dbConfig);

        const query = `
        SELECT IT.CD_PRODUTO, P.DS_PRODUTO 
        FROM ENT_PRO ENT
        INNER JOIN ITENT_PRO IT ON IT.CD_ENT_PRO = ENT.CD_ENT_PRO
        INNER JOIN ESTOQUE E ON E.CD_ESTOQUE = ENT.CD_ESTOQUE
        INNER JOIN PRODUTO P ON P.CD_PRODUTO = IT.CD_PRODUTO
        WHERE E.CD_MULTI_EMPRESA = 5
        AND IT.CD_ENT_PRO = 705
        AND IT.CD_ITENT_PRO NOT IN (SELECT CD_ITENT_PRO FROM ITLOT_ENT)`;

        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        res.status(200).json({ produtos: result.rows });

    } catch (err) {
        console.error('Erro ao executar consulta:', err.message);
        res.status(500).json({ error: 'Erro ao buscar os produtos' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Erro ao fechar conexão:', err.message);
            }
        }
    }
};
