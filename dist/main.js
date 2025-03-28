"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const init_db_1 = require("./database/init-db");
async function bootstrap() {
    try {
        const dbInitialized = await (0, init_db_1.initializeDatabase)();
        if (!dbInitialized) {
            console.error('데이터베이스 초기화 실패. 애플리케이션을 시작할 수 없습니다.');
            process.exit(1);
        }
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: '*',
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Content-Type, Accept, Authorization',
            preflightContinue: false,
            optionsSuccessStatus: 204,
        });
        await app.listen(process.env.PORT ?? 3001);
        console.log(`애플리케이션이 포트 ${process.env.PORT ?? 3001}에서 실행 중입니다.`);
    }
    catch (error) {
        console.error('애플리케이션 시작 중 오류 발생:', error);
        process.exit(1);
    }
}
bootstrap().catch((err) => {
    console.error('NestJS 애플리케이션 시작 실패:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map