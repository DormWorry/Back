"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const delivery_chat_entity_1 = require("./entities/delivery-chat.entity");
const delivery_chat_controller_1 = require("./delivery-chat.controller");
const delivery_chat_service_1 = require("./delivery-chat.service");
const delivery_room_entity_1 = require("../delivery-room/entities/delivery-room.entity");
const user_entity_1 = require("../user/entities/user.entity");
let DeliveryChatModule = class DeliveryChatModule {
};
exports.DeliveryChatModule = DeliveryChatModule;
exports.DeliveryChatModule = DeliveryChatModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([delivery_chat_entity_1.DeliveryChat, delivery_room_entity_1.DeliveryRoom, user_entity_1.User])],
        controllers: [delivery_chat_controller_1.DeliveryChatController],
        providers: [delivery_chat_service_1.DeliveryChatService],
        exports: [typeorm_1.TypeOrmModule, delivery_chat_service_1.DeliveryChatService],
    })
], DeliveryChatModule);
//# sourceMappingURL=delivery-chat.module.js.map