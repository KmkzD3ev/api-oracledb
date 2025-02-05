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
        SELECT
           Last_Active_Time,
           to_char(substr(k.SQL_FULLTEXT, 1, 4000)) AS parte1,
           to_char(substr(k.SQL_FULLTEXT, 4001, 4000)) as parte2,
           to_char(substr(k.SQL_FULLTEXT, 8001, 4000)) as parte3,
           to_char(substr(k.SQL_FULLTEXT, 12001, 4000)) as parte4,
           to_char(substr(k.SQL_FULLTEXT, 16001, 4000)) as parte5,
           to_char(substr(k.SQL_FULLTEXT, 20001, 4000)) as parte6,
           to_char(substr(k.SQL_FULLTEXT, 24001, 4000)) as parte7,
           to_date(First_Load_Time, 'rrrr-mm-dd/hh24:mi:ss') First_Load_Time,
           Plsql_Exec_Time,
           Rows_Processed,
           Parsing_Schema_Name,
           MODULE,
           Action,
           Elapsed_Time,
           to_date(Last_Load_Time, 'rrrr-mm-dd/hh24:mi:ss') Last_Load_Time
        FROM v$Sql k
        WHERE
        k.Parsing_Schema_Name = :username   
        AND TRUNC(Last_Active_Time) BETWEEN to_date(TRUNC(SYSDATE), 'dd/mm/rrrr') AND to_date(TRUNC(SYSDATE), 'dd/mm/rrrr')
        ORDER BY 1 DESC`;

        const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        res.status(200).json({ produtos: result.rows });

    } catch (err) {
        console.error('Erro ao executar consulta:', err.message);
        res.status(500).json({ error: 'Erro ao buscar os produtos 001' });
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
