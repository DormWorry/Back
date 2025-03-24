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
exports.DormitoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dormitory_entity_1 = require("./entities/dormitory.entity");
const dormitory_seed_1 = require("./seed/dormitory.seed");
const dormitory_controller_1 = require("./dormitory.controller");
let DormitoryModule = class DormitoryModule {
    constructor(dormitorySeedService) {
        this.dormitorySeedService = dormitorySeedService;
    }
    async onModuleInit() {
        await this.dormitorySeedService.seed();
    }
};
exports.DormitoryModule = DormitoryModule;
exports.DormitoryModule = DormitoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([dormitory_entity_1.Dormitory])],
        providers: [dormitory_seed_1.DormitorySeedService],
        controllers: [dormitory_controller_1.DormitoryController],
        exports: [typeorm_1.TypeOrmModule],
    }),
    __metadata("design:paramtypes", [dormitory_seed_1.DormitorySeedService])
], DormitoryModule);
//# sourceMappingURL=dormitory.module.js.map