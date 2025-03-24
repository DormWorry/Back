import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

// 환경 변수 로드
config();

// 데이터베이스 생성 함수
export async function initializeDatabase() {
  // 데이터베이스 이름을 제외한 연결 설정
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  
  try {
    console.log('데이터베이스 연결 상태 확인 중...');
    
    // DB_NAME을 제외한 연결 옵션으로 MySQL에 연결
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: parseInt(DB_PORT || '3306', 10),
      user: DB_USERNAME,
      password: DB_PASSWORD,
    });
    
    console.log('MySQL 서버에 연결됨. 데이터베이스 존재 여부 확인 중...');
    
    // 데이터베이스 존재 여부 확인
    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
      [DB_NAME],
    );
    
    const dbExists = Array.isArray(rows) && rows.length > 0;
    
    if (!dbExists) {
      console.log(`데이터베이스 '${DB_NAME}'가 존재하지 않습니다. 생성 중...`);
      
      // 데이터베이스 생성
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
      console.log(`데이터베이스 '${DB_NAME}' 생성 완료`);
    } else {
      console.log(`데이터베이스 '${DB_NAME}'가 이미 존재합니다.`);
    }
    
    await connection.end();
    console.log('데이터베이스 초기화 완료');
    
    return true;
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    return false;
  }
}
