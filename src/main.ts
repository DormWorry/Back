import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/init-db';

async function bootstrap() {
  try {
    // 애플리케이션 시작 전 데이터베이스 초기화
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error(
        '데이터베이스 초기화 실패. 애플리케이션을 시작할 수 없습니다.',
      );
      process.exit(1);
    }

    // NestJS 애플리케이션 생성
    const app = await NestFactory.create(AppModule);

    // CORS 설정 추가 - 구체적인 오리진 설정으로 변경
    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://dormworry.p-e.kr',
        // 필요한 다른 오리진 추가
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Accept,Authorization',
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // 모든 인터페이스에 바인딩하기 위해 '0.0.0.0' 추가
    await app.listen(process.env.PORT ?? 3001);
    console.log(
      `애플리케이션이 포트 ${process.env.PORT ?? 3001}에서 실행 중입니다.`,
    );
  } catch (error) {
    console.error('애플리케이션 시작 중 오류 발생:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('NestJS 애플리케이션 시작 실패:', err);
  process.exit(1);
});
