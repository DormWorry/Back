import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeDatabase } from './database/init-db';
import { Request, Response, NextFunction } from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

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
    
    // Socket.io 어댑터 설정
    app.useWebSocketAdapter(new IoAdapter(app));

    // OPTIONS 요청을 위한 특별 미들웨어 추가 (Express 직접 사용)
    app.use((req: Request, res: Response, next: NextFunction) => {
      // 요청 메서드가 OPTIONS이면
      if (req.method === 'OPTIONS') {
        // 모든 출처 허용으로 임시 변경
        res.header('Access-Control-Allow-Origin', '*');
        // 동일출처(Origin)에서 인증 쿠키 허용하려면 '*'가 아닌 구체적인 도메인이 필요함
        // Vercel에서는 현재 오류 때문에 임시로 허용하지 않음
        res.header('Access-Control-Allow-Credentials', 'false');
        // 허용할 HTTP 메서드 설정
        res.header(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        );
        // 허용할 헤더 설정
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        );
        // 캐싱 시간 설정 (24시간)
        res.header('Access-Control-Max-Age', '86400');
        // OPTIONS 요청에 204 응답 (No Content)
        return res.status(204).send();
      }
      // OPTIONS 외 다른 요청은 다음 미들웨어로 전달
      next();
    });

    // 모든 원본에서 요청 허용 (개발 환경에서만 사용)
    app.enableCors({
      origin: true, // 모든 출처 허용
      credentials: false, // 모든 출처를 허용할 때는 false로 해야 함
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders:
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      optionsSuccessStatus: 204,
      maxAge: 86400,
    });

    // 원격 서버에서 접근할 수 있도록 모든 인터페이스에 바인딩
    // CloudType은 3000번 포트로 요청을 전달하므로, 3000번 포트로 변경
    const port = process.env.PORT || 3000;
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
