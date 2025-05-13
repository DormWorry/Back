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
        app.use((req, res, next) => {
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Origin', 'https://capstone-front-nu.vercel.app');
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                res.header('Access-Control-Max-Age', '86400');
                return res.sendStatus(204);
            }
            next();
        });
        app.enableCors({
            origin: ['http://localhost:3000', 'https://capstone-front-nu.vercel.app'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            credentials: true,
            optionsSuccessStatus: 204,
            maxAge: 86400,
        });
        const port = process.env.PORT || 3001;
        await app.listen(port, '0.0.0.0');
        console.log(`애플리케이션이 포트 ${port}에서 실행 중입니다.`);
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