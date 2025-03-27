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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    handleOptions(res) {
        this.setCorsHeaders(res);
        return res.sendStatus(204);
    }
    handleKakaoTokenOptions(res) {
        this.setCorsHeaders(res);
        return res.sendStatus(204);
    }
    kakaoLogin() {
        return;
    }
    kakaoCallback(req, res) {
        const user = req.user;
        const token = this.authService.generateToken(user);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const redirectUrl = `${frontendUrl}/auth/callback?token=${token.access_token}&isNewUser=${user.isNewUser}`;
        return res.redirect(redirectUrl);
    }
    async exchangeKakaoToken(body, res) {
        this.setCorsHeaders(res);
        try {
            const { code } = body;
            console.log(code);
            if (!code) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: '인증 코드가 필요합니다.',
                });
            }
            const kakaoToken = await this.authService.getKakaoToken(code);
            const kakaoUser = await this.authService.getKakaoUserInfo(kakaoToken.access_token);
            const user = await this.authService.findOrCreateUserByKakaoId(String(kakaoUser.id), kakaoUser.properties.nickname, kakaoUser.kakao_account?.email);
            const token = this.authService.generateToken(user);
            return res.status(common_1.HttpStatus.OK).json({
                success: true,
                data: {
                    accessToken: token.access_token,
                    user: {
                        id: user.id,
                        nickname: user.nickname,
                        email: user.email,
                        isNewUser: user.isNewUser,
                    },
                },
            });
        }
        catch (error) {
            console.error('카카오 토큰 교환 오류:', error);
            const errorMessage = error instanceof Error
                ? error.message
                : '카카오 로그인 처리 중 오류가 발생했습니다.';
            const errorStatus = error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            this.setCorsHeaders(res);
            return res.status(errorStatus).json({
                success: false,
                message: errorMessage,
            });
        }
    }
    getKakaoLoginStatus(req) {
        const user = req.user;
        return {
            isLoggedIn: true,
            isNewUser: user.isNewUser,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                studentId: user.studentId,
                department: user.department,
                dormitoryId: user.dormitoryId,
                roomNumber: user.roomNumber,
                gender: user.gender,
            },
        };
    }
    async updateProfile(req, profileData) {
        try {
            const userId = req.user.id;
            const updatedUser = await this.authService.updateUserProfile(userId, profileData);
            return {
                success: true,
                data: {
                    user: {
                        id: updatedUser.id,
                        nickname: updatedUser.nickname,
                        email: updatedUser.email,
                        studentId: updatedUser.studentId,
                        department: updatedUser.department,
                        dormitoryId: updatedUser.dormitoryId,
                        roomNumber: updatedUser.roomNumber,
                        gender: updatedUser.gender,
                        isNewUser: updatedUser.isNewUser,
                    },
                },
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : '프로필 업데이트 중 오류가 발생했습니다.';
            const errorStatus = error instanceof common_1.HttpException
                ? error.getStatus()
                : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            throw new common_1.HttpException(errorMessage, errorStatus);
        }
    }
    getProfile(req) {
        const user = req.user;
        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email,
                    studentId: user.studentId,
                    department: user.department,
                    dormitoryId: user.dormitoryId,
                    roomNumber: user.roomNumber,
                    gender: user.gender,
                    isNewUser: user.isNewUser,
                },
            },
        };
    }
    setCorsHeaders(res) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Max-Age', '86400');
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Options)('*'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleOptions", null);
__decorate([
    (0, common_1.Options)('kakao/token'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "handleKakaoTokenOptions", null);
__decorate([
    (0, common_1.Get)('kakao'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "kakaoLogin", null);
__decorate([
    (0, common_1.Get)('kakao/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('kakao')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "kakaoCallback", null);
__decorate([
    (0, common_1.Post)('kakao/token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "exchangeKakaoToken", null);
__decorate([
    (0, common_1.Get)('kakao/status'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getKakaoLoginStatus", null);
__decorate([
    (0, common_1.Post)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map