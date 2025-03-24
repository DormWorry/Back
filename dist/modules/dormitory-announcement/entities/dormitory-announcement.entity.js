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
exports.DormitoryAnnouncement = void 0;
const typeorm_1 = require("typeorm");
const dormitory_entity_1 = require("../../dormitory/entities/dormitory.entity");
let DormitoryAnnouncement = class DormitoryAnnouncement {
};
exports.DormitoryAnnouncement = DormitoryAnnouncement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DormitoryAnnouncement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DormitoryAnnouncement.prototype, "dormitoryId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DormitoryAnnouncement.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DormitoryAnnouncement.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], DormitoryAnnouncement.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DormitoryAnnouncement.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DormitoryAnnouncement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DormitoryAnnouncement.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => dormitory_entity_1.Dormitory, (dormitory) => dormitory.announcements),
    (0, typeorm_1.JoinColumn)({ name: 'dormitoryId' }),
    __metadata("design:type", dormitory_entity_1.Dormitory)
], DormitoryAnnouncement.prototype, "dormitory", void 0);
exports.DormitoryAnnouncement = DormitoryAnnouncement = __decorate([
    (0, typeorm_1.Entity)()
], DormitoryAnnouncement);
//# sourceMappingURL=dormitory-announcement.entity.js.map