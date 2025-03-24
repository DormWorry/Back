"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoom = exports.DeliveryRoomStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const delivery_participant_entity_1 = require("../../delivery-participant/entities/delivery-participant.entity");
const delivery_chat_entity_1 = require("../../delivery-chat/entities/delivery-chat.entity");
var DeliveryRoomStatus;
(function (DeliveryRoomStatus) {
    DeliveryRoomStatus["OPEN"] = "open";
    DeliveryRoomStatus["CLOSED"] = "closed";
    DeliveryRoomStatus["COMPLETED"] = "completed";
})(DeliveryRoomStatus || (exports.DeliveryRoomStatus = DeliveryRoomStatus = {}));
let DeliveryRoom = class DeliveryRoom {
};
exports.DeliveryRoom = DeliveryRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "restaurantName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DeliveryRoom.prototype, "minimumOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DeliveryRoom.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: DeliveryRoomStatus,
        default: DeliveryRoomStatus.OPEN,
    }),
    __metadata("design:type", String)
], DeliveryRoom.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DeliveryRoom.prototype, "orderedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryRoom.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryRoom.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdDeliveryRooms),
    (0, typeorm_1.JoinColumn)({ name: 'creatorId' }),
    __metadata("design:type", user_entity_1.User)
], DeliveryRoom.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_participant_entity_1.DeliveryParticipant, (participant) => participant.deliveryRoom),
    __metadata("design:type", Array)
], DeliveryRoom.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_chat_entity_1.DeliveryChat, (chat) => chat.deliveryRoom),
    __metadata("design:type", Array)
], DeliveryRoom.prototype, "chats", void 0);
exports.DeliveryRoom = DeliveryRoom = __decorate([
    (0, typeorm_1.Entity)()
], DeliveryRoom);
//# sourceMappingURL=delivery-room.entity.js.map