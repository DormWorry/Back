import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/init-db';

async function bootstrap() {
  try {
    // 애플리케이션 시작 전 데이터베이스 초기화
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('데이터베이스 초기화 실패. 애플리케이션을 시작할 수 없습니다.');
      process.exit(1);
    }

    // NestJS 애플리케이션 생성
    const app = await NestFactory.create(AppModule);

    // CORS 설정 추가 - 모든 오리진 허용 및 OPTIONS 요청 처리 강화
    app.enableCors({
      origin: true, // 모든 도메인에서 접근 허용
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // 모든 인터페이스에 바인딩하기 위해 '0.0.0.0' 추가
    await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
    console.log(`애플리케이션이 포트 ${process.env.PORT ?? 3001}에서 실행 중입니다.`);
  } catch (error) {
    console.error('애플리케이션 시작 중 오류 발생:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('NestJS 애플리케이션 시작 실패:', err);
  process.exit(1);
});
