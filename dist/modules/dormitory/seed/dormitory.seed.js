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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DormitorySeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dormitory_entity_1 = require("../entities/dormitory.entity");
let DormitorySeedService = class DormitorySeedService {
    constructor(dormitoryRepository) {
        this.dormitoryRepository = dormitoryRepository;
    }
    async seed() {
        const count = await this.dormitoryRepository.count();
        if (count === 0) {
            const dormitories = [
                {
                    id: 1,
                    name: '제 1기숙사',
                },
                {
                    id: 2,
                    name: '제 2기숙사',
                },
                {
                    id: 3,
                    name: '제 3기숙사',
                },
            ];
            for (const dormitory of dormitories) {
                const existingDormitory = await this.dormitoryRepository.findOne({
                    where: { id: dormitory.id },
                });
                if (existingDormitory) {
                    await this.dormitoryRepository.update(dormitory.id, dormitory);
                }
                else {
                    await this.dormitoryRepository
                        .createQueryBuilder()
                        .insert()
                        .into(dormitory_entity_1.Dormitory)
                        .values(dormitory)
                        .execute();
                }
            }
            console.log('기숙사 시드 데이터 생성/업데이트 완료:', dormitories);
            return await this.dormitoryRepository.find();
        }
        console.log('기숙사 데이터가 이미 존재합니다. 시드 생성을 건너뜁니다.');
        return await this.dormitoryRepository.find();
    }
};
exports.DormitorySeedService = DormitorySeedService;
exports.DormitorySeedService = DormitorySeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(dormitory_entity_1.Dormitory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DormitorySeedService);
//# sourceMappingURL=dormitory.seed.js.map