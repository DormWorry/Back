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
exports.LetterController = void 0;
const common_1 = require("@nestjs/common");
const letter_service_1 = require("./letter.service");
const create_letter_dto_1 = require("./dto/create-letter.dto");
const passport_1 = require("@nestjs/passport");
let LetterController = class LetterController {
    constructor(letterService) {
        this.letterService = letterService;
    }
    async getReceivedLetters(req, page = 1, limit = 10) {
        const userRoomNumber = req.user.roomNumber;
        return this.letterService.getReceivedLetters(userRoomNumber, page, limit);
    }
    async getSentLetters(req, page = 1, limit = 10) {
        const userRoomNumber = req.user.roomNumber;
        return this.letterService.getSentLetters(userRoomNumber, page, limit);
    }
    async getLetterById(id, req) {
        const userRoomNumber = req.user.roomNumber;
        return this.letterService.getLetterById(id, userRoomNumber);
    }
    async createLetter(createLetterDto, req) {
        createLetterDto.senderRoomNumber = req.user.roomNumber;
        createLetterDto.senderName = req.user.name || req.user.nickname;
        const senderUserId = req.user.id;
        return this.letterService.createLetter(createLetterDto, senderUserId);
    }
};
exports.LetterController = LetterController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('received'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "getReceivedLetters", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('sent'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "getSentLetters", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "getLetterById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_letter_dto_1.CreateLetterDto, Object]),
    __metadata("design:returntype", Promise)
], LetterController.prototype, "createLetter", null);
exports.LetterController = LetterController = __decorate([
    (0, common_1.Controller)('letters'),
    __metadata("design:paramtypes", [letter_service_1.LetterService])
], LetterController);
//# sourceMappingURL=letter.controller.js.map