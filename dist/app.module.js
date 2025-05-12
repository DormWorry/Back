"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const letter_module_1 = require("./modules/letter/letter.module");
const user_module_1 = require("./modules/user/user.module");
const personality_type_module_1 = require("./modules/personality-type/personality-type.module");
const roommate_profile_module_1 = require("./modules/roommate-profile/roommate-profile.module");
const delivery_room_module_1 = require("./modules/delivery-room/delivery-room.module");
const delivery_participant_module_1 = require("./modules/delivery-participant/delivery-participant.module");
const delivery_chat_module_1 = require("./modules/delivery-chat/delivery-chat.module");
const dormitory_module_1 = require("./modules/dormitory/dormitory.module");
const dormitory_announcement_module_1 = require("./modules/dormitory-announcement/dormitory-announcement.module");
const auth_module_1 = require("./modules/auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'mysql',
                    host: configService.get('DB_HOST'),
                    port: parseInt(configService.get('DB_PORT') ?? '3306', 10),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    ssl: configService.get('NODE_ENV') === 'production' ? {
                        rejectUnauthorized: false
                    } : false,
                    extra: {
                        connectionLimit: 10,
                        connectTimeout: 60000,
                        acquireTimeout: 60000,
                        waitForConnections: true,
                        queueLimit: 0,
                    },
                    logging: configService.get('NODE_ENV') !== 'production',
                    autoLoadEntities: true,
                }),
            }),
            letter_module_1.LetterModule,
            user_module_1.UserModule,
            personality_type_module_1.PersonalityTypeModule,
            roommate_profile_module_1.RoommateProfileModule,
            delivery_room_module_1.DeliveryRoomModule,
            delivery_participant_module_1.DeliveryParticipantModule,
            delivery_chat_module_1.DeliveryChatModule,
            dormitory_module_1.DormitoryModule,
            dormitory_announcement_module_1.DormitoryAnnouncementModule,
            auth_module_1.AuthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map