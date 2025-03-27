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

    // CORS 미들웨어를 모든 요청에 적용
    app.use((req, res, next) => {
      // 요청의 오리진을 가져옴
      const origin = req.headers.origin;
      // OPTIONS 메서드 처리를 위한 응답 헤더 설정
      if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', origin || '*');
        res.header(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        res.header(
          'Access-Control-Allow-Headers',
          'Content-Type,Accept,Authorization',
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
        res.statusCode = 204;
        return res.end();
      }
      // 다른 모든 요청에 대해서도 CORS 헤더 설정
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });

    // CORS 설정 추가 - 와일드카드 대신 모든 오리진 허용으로 변경
    app.enableCors({
      origin: true, // 모든 오리진 허용하되 요청의 오리진을 그대로 응답 헤더에 반영
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type,Accept,Authorization',
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });

    // 모든 인터페이스에 바인딩하기 위해 '0.0.0.0' 추가
    await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
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
