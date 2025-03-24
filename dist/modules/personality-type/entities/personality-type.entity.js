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
exports.PersonalityType = void 0;
const typeorm_1 = require("typeorm");
const roommate_profile_entity_1 = require("../../roommate-profile/entities/roommate-profile.entity");
let PersonalityType = class PersonalityType {
};
exports.PersonalityType = PersonalityType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PersonalityType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PersonalityType.prototype, "typeName", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], PersonalityType.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => roommate_profile_entity_1.RoommateProfile, (profile) => profile.myPersonalityType),
    __metadata("design:type", Array)
], PersonalityType.prototype, "profilesWithThisType", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => roommate_profile_entity_1.RoommateProfile, (profile) => profile.preferredPersonalityType),
    __metadata("design:type", Array)
], PersonalityType.prototype, "profilesPreferringThisType", void 0);
exports.PersonalityType = PersonalityType = __decorate([
    (0, typeorm_1.Entity)()
], PersonalityType);
//# sourceMappingURL=personality-type.entity.js.map