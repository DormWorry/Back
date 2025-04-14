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
exports.LetterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const letter_entity_1 = require("./entities/letter.entity");
const user_entity_1 = require("../user/entities/user.entity");
let LetterService = class LetterService {
    constructor(letterRepository, userRepository) {
        this.letterRepository = letterRepository;
        this.userRepository = userRepository;
    }
    async getReceivedLetters(roomNumber, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [letters, total] = await this.letterRepository.findAndCount({
            where: { recipientRoomNumber: roomNumber },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        const processedLetters = letters.map((letter) => {
            if (letter.isAnonymous) {
                return {
                    ...letter,
                    senderRoomNumber: null,
                    senderName: '익명',
                };
            }
            return letter;
        });
        return {
            data: processedLetters,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getSentLetters(roomNumber, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [letters, total] = await this.letterRepository.findAndCount({
            where: { senderRoomNumber: roomNumber },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data: letters,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getLetterById(id, userRoomNumber) {
        const letter = await this.letterRepository.findOne({ where: { id } });
        if (!letter) {
            throw new common_1.NotFoundException('편지를 찾을 수 없습니다.');
        }
        if (letter.senderRoomNumber !== userRoomNumber &&
            letter.recipientRoomNumber !== userRoomNumber) {
            throw new common_1.ForbiddenException('해당 편지에 접근할 권한이 없습니다.');
        }
        if (letter.recipientRoomNumber === userRoomNumber && !letter.isRead) {
            letter.isRead = true;
            await this.letterRepository.save(letter);
        }
        if (letter.isAnonymous && letter.recipientRoomNumber === userRoomNumber) {
            return {
                ...letter,
                senderRoomNumber: null,
                senderName: '익명',
            };
        }
        return letter;
    }
    async createLetter(createLetterDto, senderUserId) {
        try {
            const recipient = await this.userRepository.findOne({
                where: { roomNumber: createLetterDto.recipientRoomNumber }
            });
            if (!recipient) {
                throw new common_1.NotFoundException(`방 번호 ${createLetterDto.recipientRoomNumber}에 해당하는 사용자를 찾을 수 없습니다.`);
            }
            const newLetter = new letter_entity_1.Letter();
            newLetter.title = createLetterDto.title;
            newLetter.content = createLetterDto.content;
            newLetter.senderRoomNumber = createLetterDto.senderRoomNumber;
            newLetter.senderName = createLetterDto.senderName || '';
            newLetter.recipientRoomNumber = createLetterDto.recipientRoomNumber;
            newLetter.isAnonymous = createLetterDto.isAnonymous;
            newLetter.senderUserId = senderUserId;
            newLetter.recipientUserId = recipient.id.toString();
            newLetter.isRead = false;
            return this.letterRepository.save(newLetter);
        }
        catch (error) {
            console.error('편지 생성 오류:', error);
            throw error;
        }
    }
};
exports.LetterService = LetterService;
exports.LetterService = LetterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(letter_entity_1.Letter)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LetterService);
//# sourceMappingURL=letter.service.js.map