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

    // 모든 원본에서 요청 허용 (개발 환경에서만 사용)
    app.enableCors({
      origin: ['https://capstone-front-nu.vercel.app'], // ← 명시적 도메인 지정
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      optionsSuccessStatus: 204,
      maxAge: 86400,
    });

    // 원격 서버에서 접근할 수 있도록 모든 인터페이스에 바인딩
    // 환경 변수에서 포트를 가져오거나 기본값으로 3000 사용
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
  } catch (error) {
    console.error('애플리케이션 시작 중 오류 발생:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('NestJS 애플리케이션 시작 실패:', err);
  process.exit(1);
});
