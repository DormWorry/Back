import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/init-db';
import { Request, Response, NextFunction } from 'express';

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

    // OPTIONS 요청을 위한 전역 핸들러 추가
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method === 'OPTIONS') {
        res.header(
          'Access-Control-Allow-Origin',
          'https://capstone-front-nu.vercel.app',
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        res.header('Access-Control-Max-Age', '86400'); // 24시간 캐싱
        return res.sendStatus(204); // No Content 응답
      }
      next();
    });

    // 모든 출처에서의 접근을 허용하는 간단한 CORS 설정
    app.enableCors({
      origin: ['http://localhost:3000', 'https://capstone-front-nu.vercel.app'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      credentials: true,
      optionsSuccessStatus: 204,
      maxAge: 86400, // preflight 요청 캐싱 시간 24시간
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
