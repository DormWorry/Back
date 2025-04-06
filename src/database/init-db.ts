import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

// 환경 변수 로드
config();

// 데이터베이스 생성 함수
export async function initializeDatabase() {
  // 데이터베이스 이름을 제외한 연결 설정
  const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

  // 연결 설정 로깅 (비밀번호 제외)
  console.log('데이터베이스 연결 설정:', {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USERNAME,
    database: DB_NAME,
    // 비밀번호는 보안상 로깅하지 않음
  });

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

      // 문제 해결을 위한 코드: dormitory 테이블 확인 및 초기화
      // 개발 환경에서만 실행
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '개발 환경에서 실행 중. 문제 해결을 위한 테이블 초기화 시도...',
        );

        // dormitory 테이블이 존재하는지 확인
        await connection.query(`USE \`${DB_NAME}\``);
        try {
          const [tableCheck] = await connection.query(
            `SHOW TABLES LIKE 'dormitory'`,
          );

          if (Array.isArray(tableCheck) && tableCheck.length > 0) {
            console.log(
              'dormitory 테이블이 존재합니다. 문제 해결을 위해 테이블 재설정...',
            );

            // 테이블 초기화 시도
            try {
              await connection.query('SET FOREIGN_KEY_CHECKS = 0');
              await connection.query('DROP TABLE IF EXISTS dormitory');
              console.log(
                'dormitory 테이블 삭제 완료. 애플리케이션 시작 시 다시 생성됩니다.',
              );
              await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            } catch (dropError) {
              console.error('테이블 삭제 중 오류:', dropError);
            }
          }
        } catch (tableCheckError) {
          console.error('테이블 확인 중 오류:', tableCheckError);
        }
      }
    }

    await connection.end();
    console.log('데이터베이스 초기화 완료');

    return true;
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    return false;
  }
}
