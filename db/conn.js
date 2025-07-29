require("dotenv").config();
const mysql = require('mysql2');
const logger = require('../logger');

logger.database("Iniciando configuração da conexão com banco de dados");

const pool = mysql.createPool({
    connectionLimit: process.env.CONNECTION_LIMIT || 10,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.PORT || 3306,
});

pool.getConnection((err, connection) => {
    if (err) {
        logger.error("Erro ao conectar com banco de dados", { 
            error: err.message, 
            code: err.code,
            host: process.env.HOST,
            database: process.env.DATABASE,
            port: process.env.PORT || 3306
        });
        return;
    }
    
    logger.database("Conexão com banco de dados estabelecida com sucesso", {
        host: process.env.HOST,
        database: process.env.DATABASE,
        port: process.env.PORT || 3306,
        threadId: connection.threadId
    });
    
    connection.release();
});

pool.on('connection', (connection) => {
    logger.database("Nova conexão criada no pool", { 
        threadId: connection.threadId 
    });
});

pool.on('acquire', (connection) => {
    logger.debug("Conexão adquirida do pool", { 
        threadId: connection.threadId 
    });
});

pool.on('release', (connection) => {
    logger.debug("Conexão liberada para o pool", { 
        threadId: connection.threadId 
    });
});

pool.on('enqueue', () => {
    logger.warn("Conexão enfileirada - pool pode estar sobrecarregado");
});

process.on('SIGINT', () => {
    logger.database("Encerrando pool de conexões do banco de dados");
    pool.end((err) => {
        if (err) {
            logger.error("Erro ao encerrar pool de conexões", { error: err.message });
        } else {
            logger.database("Pool de conexões encerrado com sucesso");
        }
    });
});

module.exports = pool;