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
exports.DeliveryParticipant = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const delivery_room_entity_1 = require("../../delivery-room/entities/delivery-room.entity");
let DeliveryParticipant = class DeliveryParticipant {
};
exports.DeliveryParticipant = DeliveryParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DeliveryParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliveryParticipant.prototype, "deliveryRoomId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DeliveryParticipant.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], DeliveryParticipant.prototype, "orderDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DeliveryParticipant.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], DeliveryParticipant.prototype, "isPaid", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DeliveryParticipant.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => delivery_room_entity_1.DeliveryRoom, (deliveryRoom) => deliveryRoom.participants),
    (0, typeorm_1.JoinColumn)({ name: 'deliveryRoomId' }),
    __metadata("design:type", delivery_room_entity_1.DeliveryRoom)
], DeliveryParticipant.prototype, "deliveryRoom", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.deliveryParticipations),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], DeliveryParticipant.prototype, "user", void 0);
exports.DeliveryParticipant = DeliveryParticipant = __decorate([
    (0, typeorm_1.Entity)()
], DeliveryParticipant);
//# sourceMappingURL=delivery-participant.entity.js.map