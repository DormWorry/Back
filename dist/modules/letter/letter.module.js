"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LetterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const letter_entity_1 = require("./entities/letter.entity");
const letter_service_1 = require("./letter.service");
const letter_controller_1 = require("./letter.controller");
const user_entity_1 = require("../user/entities/user.entity");
let LetterModule = class LetterModule {
};
exports.LetterModule = LetterModule;
exports.LetterModule = LetterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([letter_entity_1.Letter, user_entity_1.User])],
        controllers: [letter_controller_1.LetterController],
        providers: [letter_service_1.LetterService],
        exports: [letter_service_1.LetterService],
    })
], LetterModule);
//# sourceMappingURL=letter.module.js.map