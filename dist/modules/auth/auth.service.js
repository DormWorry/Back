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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const axios_1 = require("axios");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    async findOrCreateUserByKakaoId(kakaoId, nickname, email) {
        let user = await this.usersRepository.findOne({ where: { kakaoId } });
        if (!user && email) {
            user = await this.usersRepository.findOne({ where: { email } });
        }
        if (!user) {
            user = this.usersRepository.create({
                kakaoId,
                email,
                nickname,
                isNewUser: true,
            });
            await this.usersRepository.save(user);
        }
        else if (!user.kakaoId) {
            user.kakaoId = kakaoId;
            await this.usersRepository.save(user);
        }
        return user;
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            nickname: user.nickname,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async getKakaoToken(code) {
        try {
            const tokenUrl = 'https://kauth.kakao.com/oauth/token';
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('client_id', process.env.KAKAO_CLIENT_ID || '');
            params.append('redirect_uri', process.env.KAKAO_CALLBACK_URL || '');
            params.append('code', code);
            const response = await axios_1.default.post(tokenUrl, params.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('카카오 토큰 교환 오류:', error instanceof axios_1.AxiosError
                ? error.response?.data
                : error instanceof Error
                    ? error.message
                    : '알 수 없는 오류');
            throw new Error('카카오 토큰 교환 중 오류가 발생했습니다.');
        }
    }
    async getKakaoUserInfo(accessToken) {
        try {
            const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
            const response = await axios_1.default.get(userInfoUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('카카오 사용자 정보 조회 오류:', error instanceof axios_1.AxiosError
                ? error.response?.data
                : error instanceof Error
                    ? error.message
                    : '알 수 없는 오류');
            throw new Error('카카오 사용자 정보 조회 중 오류가 발생했습니다.');
        }
    }
    async updateUserProfile(userId, profileData) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, { ...profileData, isNewUser: false });
        return this.usersRepository.save(user);
    }
    async updateUserProfileByKakaoId(kakaoId, profileData) {
        const user = await this.usersRepository.findOne({ where: { kakaoId } });
        if (!user) {
            throw new Error(`KakaoId ${kakaoId}에 해당하는 사용자를 찾을 수 없습니다.`);
        }
        const updateData = { ...profileData, isNewUser: false };
        if (updateData.dormitoryId === undefined ||
            updateData.dormitoryId === null ||
            updateData.dormitoryId === 0) {
            delete updateData.dormitoryId;
        }
        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map