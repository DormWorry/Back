"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoommateProfileModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const roommate_profile_entity_1 = require("./entities/roommate-profile.entity");
const personality_type_entity_1 = require("../personality-type/entities/personality-type.entity");
const roommate_profile_controller_1 = require("./roommate-profile.controller");
const roommate_profile_service_1 = require("./roommate-profile.service");
let RoommateProfileModule = class RoommateProfileModule {
};
exports.RoommateProfileModule = RoommateProfileModule;
exports.RoommateProfileModule = RoommateProfileModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([roommate_profile_entity_1.RoommateProfile, personality_type_entity_1.PersonalityType])],
        controllers: [roommate_profile_controller_1.RoommateProfileController],
        providers: [roommate_profile_service_1.RoommateProfileService],
        exports: [typeorm_1.TypeOrmModule, roommate_profile_service_1.RoommateProfileService],
    })
], RoommateProfileModule);
//# sourceMappingURL=roommate-profile.module.js.map