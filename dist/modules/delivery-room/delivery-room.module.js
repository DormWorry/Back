"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoomModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const delivery_room_entity_1 = require("./entities/delivery-room.entity");
const delivery_room_controller_1 = require("./delivery-room.controller");
const delivery_room_service_1 = require("./delivery-room.service");
const delivery_room_gateway_1 = require("./delivery-room.gateway");
const user_entity_1 = require("../user/entities/user.entity");
const delivery_participant_module_1 = require("../delivery-participant/delivery-participant.module");
const delivery_chat_module_1 = require("../delivery-chat/delivery-chat.module");
let DeliveryRoomModule = class DeliveryRoomModule {
};
exports.DeliveryRoomModule = DeliveryRoomModule;
exports.DeliveryRoomModule = DeliveryRoomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([delivery_room_entity_1.DeliveryRoom, user_entity_1.User]),
            delivery_participant_module_1.DeliveryParticipantModule,
            delivery_chat_module_1.DeliveryChatModule,
        ],
        controllers: [delivery_room_controller_1.DeliveryRoomController],
        providers: [delivery_room_service_1.DeliveryRoomService, delivery_room_gateway_1.DeliveryRoomGateway],
        exports: [typeorm_1.TypeOrmModule, delivery_room_service_1.DeliveryRoomService],
    })
], DeliveryRoomModule);
//# sourceMappingURL=delivery-room.module.js.map