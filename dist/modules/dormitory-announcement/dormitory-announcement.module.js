"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DormitoryAnnouncementModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dormitory_announcement_entity_1 = require("./entities/dormitory-announcement.entity");
let DormitoryAnnouncementModule = class DormitoryAnnouncementModule {
};
exports.DormitoryAnnouncementModule = DormitoryAnnouncementModule;
exports.DormitoryAnnouncementModule = DormitoryAnnouncementModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dormitory_announcement_entity_1.DormitoryAnnouncement])],
        controllers: [],
        providers: [],
        exports: [typeorm_1.TypeOrmModule],
    })
], DormitoryAnnouncementModule);
//# sourceMappingURL=dormitory-announcement.module.js.map