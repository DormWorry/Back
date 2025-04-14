"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const mysql = require("mysql2/promise");
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const personality_types_seed_1 = require("./seed/personality-types.seed");
(0, dotenv_1.config)();
async function initializeDatabase() {
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
    try {
        console.log('데이터베이스 연결 상태 확인 중...');
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: parseInt(DB_PORT || '3306', 10),
            user: DB_USERNAME,
            password: DB_PASSWORD,
        });
        console.log('MySQL 서버에 연결됨. 데이터베이스 존재 여부 확인 중...');
        const [rows] = await connection.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [DB_NAME]);
        const dbExists = Array.isArray(rows) && rows.length > 0;
        if (!dbExists) {
            console.log(`데이터베이스 '${DB_NAME}'가 존재하지 않습니다. 생성 중...`);
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
            console.log(`데이터베이스 '${DB_NAME}' 생성 완료`);
        }
        else {
            console.log(`데이터베이스 '${DB_NAME}'가 이미 존재합니다.`);
        }
        await connection.end();
        console.log('데이터베이스 초기화 완료');
        try {
            const typeormConnection = await (0, typeorm_1.createConnection)({
                type: 'mysql',
                host: DB_HOST,
                port: parseInt(DB_PORT || '3306', 10),
                username: DB_USERNAME,
                password: DB_PASSWORD,
                database: DB_NAME,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: false,
            });
            await (0, personality_types_seed_1.seedPersonalityTypes)(typeormConnection);
            await typeormConnection.close();
        }
        catch (seedError) {
            console.error('시드 데이터 적용 중 오류 발생:', seedError);
        }
        return true;
    }
    catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
        return false;
    }
}
//# sourceMappingURL=init-db.js.map