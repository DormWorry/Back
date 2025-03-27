import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { User } from '../user/entities/user.entity';
interface RequestWithUser extends Request {
    user: User;
}
interface ProfileUpdateDto {
    nickname: string;
    studentId: string;
    department: string;
    dormitoryId: string;
    roomNumber: string;
    gender: string;
    kakaoId?: string;
}
interface KakaoTokenExchangeDto {
    code: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    handleOptions(res: Response): Response<any, Record<string, any>>;
    handleKakaoTokenOptions(res: Response): Response<any, Record<string, any>>;
    kakaoLogin(): void;
    kakaoCallback(req: RequestWithUser, res: Response): void;
    exchangeKakaoToken(body: KakaoTokenExchangeDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getKakaoLoginStatus(req: RequestWithUser): {
        isLoggedIn: boolean;
        isNewUser: boolean;
        user: {
            id: number;
            nickname: string;
            email: string;
            studentId: string;
            department: string;
            dormitoryId: string;
            roomNumber: string;
            gender: import("../user/entities/user.entity").Gender;
        };
    };
    updateProfile(req: RequestWithUser, profileData: ProfileUpdateDto): Promise<{
        success: boolean;
        data: {
            user: {
                id: number;
                nickname: string;
                email: string;
                studentId: string;
                department: string;
                dormitoryId: string;
                roomNumber: string;
                gender: import("../user/entities/user.entity").Gender;
                isNewUser: boolean;
            };
        };
    }>;
    getProfile(req: RequestWithUser): {
        success: boolean;
        data: {
            user: {
                id: number;
                nickname: string;
                email: string;
                studentId: string;
                department: string;
                dormitoryId: string;
                roomNumber: string;
                gender: import("../user/entities/user.entity").Gender;
                isNewUser: boolean;
            };
        };
    };
    private setCorsHeaders;
}
export {};
