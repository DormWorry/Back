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
exports.RoommateProfile = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const personality_type_entity_1 = require("../../personality-type/entities/personality-type.entity");
let RoommateProfile = class RoommateProfile {
};
exports.RoommateProfile = RoommateProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoommateProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoommateProfile.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoommateProfile.prototype, "myPersonalityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoommateProfile.prototype, "preferredPersonalityTypeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoommateProfile.prototype, "kakaoTalkId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoommateProfile.prototype, "instagramId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], RoommateProfile.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], RoommateProfile.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoommateProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RoommateProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], RoommateProfile.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => personality_type_entity_1.PersonalityType),
    (0, typeorm_1.JoinColumn)({ name: 'myPersonalityTypeId' }),
    __metadata("design:type", personality_type_entity_1.PersonalityType)
], RoommateProfile.prototype, "myPersonalityType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => personality_type_entity_1.PersonalityType),
    (0, typeorm_1.JoinColumn)({ name: 'preferredPersonalityTypeId' }),
    __metadata("design:type", personality_type_entity_1.PersonalityType)
], RoommateProfile.prototype, "preferredPersonalityType", void 0);
exports.RoommateProfile = RoommateProfile = __decorate([
    (0, typeorm_1.Entity)()
], RoommateProfile);
//# sourceMappingURL=roommate-profile.entity.js.map