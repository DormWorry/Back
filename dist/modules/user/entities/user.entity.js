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
exports.User = exports.DORMITORY_TYPES = exports.Gender = void 0;
const typeorm_1 = require("typeorm");
const dormitory_entity_1 = require("../../dormitory/entities/dormitory.entity");
const letter_entity_1 = require("../../letter/entities/letter.entity");
const delivery_room_entity_1 = require("../../delivery-room/entities/delivery-room.entity");
const delivery_participant_entity_1 = require("../../delivery-participant/entities/delivery-participant.entity");
const delivery_chat_entity_1 = require("../../delivery-chat/entities/delivery-chat.entity");
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
})(Gender || (exports.Gender = Gender = {}));
exports.DORMITORY_TYPES = {
    DORM1: '제 1기숙사',
    DORM2: '제 2기숙사',
    DORM3: '제 3기숙사',
};
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "kakaoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], User.prototype, "dormitoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Gender,
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isNewUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dormitory_entity_1.Dormitory),
    (0, typeorm_1.JoinColumn)({ name: 'dormitoryId' }),
    __metadata("design:type", dormitory_entity_1.Dormitory)
], User.prototype, "dormitory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_entity_1.Letter, (letter) => letter.sender),
    __metadata("design:type", Array)
], User.prototype, "sentLetters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => letter_entity_1.Letter, (letter) => letter.recipient),
    __metadata("design:type", Array)
], User.prototype, "receivedLetters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_room_entity_1.DeliveryRoom, (deliveryRoom) => deliveryRoom.creator),
    __metadata("design:type", Array)
], User.prototype, "createdDeliveryRooms", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_participant_entity_1.DeliveryParticipant, (participant) => participant.user),
    __metadata("design:type", Array)
], User.prototype, "deliveryParticipations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => delivery_chat_entity_1.DeliveryChat, (chat) => chat.user),
    __metadata("design:type", Array)
], User.prototype, "deliveryChats", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=user.entity.js.map