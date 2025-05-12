"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const mysql = require("mysql2/promise");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
async function initializeDatabase() {
    const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
    try {
        console.log('데이터베이스 연결 상태 확인 중...');
        console.log(`연결 시도 중: ${DB_HOST}:${DB_PORT}`);
        const connection = await mysql.createConnection({
            host: DB_HOST,
            port: parseInt(DB_PORT || '3306', 10),
            user: DB_USERNAME,
            password: DB_PASSWORD,
            connectTimeout: 60000,
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
        return true;
    }
    catch (error) {
        console.error('데이터베이스 초기화 중 오류 발생:', error);
        if (error.code === 'ETIMEDOUT') {
            console.error(`
연결 시간 초과 오류가 발생했습니다. 다음 사항을 확인하세요:
1. AWS RDS 보안 그룹에서 현재 IP가 허용되어 있는지 확인
2. RDS 인스턴스가 실행 중인지 확인
3. 데이터베이스 자격 증명(사용자 이름/비밀번호)이 올바른지 확인
      `);
        }
        else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('데이터베이스 사용자 이름 또는 비밀번호가 올바르지 않습니다.');
        }
        else if (error.code === 'ENOTFOUND') {
            console.error('데이터베이스 호스트를 찾을 수 없습니다. 호스트 이름이 올바른지 확인하세요.');
        }
        return false;
    }
}
//# sourceMappingURL=init-db.js.map