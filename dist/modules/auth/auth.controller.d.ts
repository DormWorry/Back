import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare class ProfileUpdateDto {
    kakaoId?: string;
    nickname?: string;
    email?: string;
    studentId?: string;
    department?: string;
    dormitoryId?: number;
    roomNumber?: string;
    gender?: Gender;
    isNewUser?: boolean;
}
export declare class KakaoTokenExchangeDto {
    code: string;
    redirectUri?: string;
}
interface RequestWithUser extends Request {
    user: User;
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
            roomNumber: string;
            gender: import("../user/entities/user.entity").Gender;
        };
    };
    updateProfile(profileData: ProfileUpdateDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getProfile(req: RequestWithUser): {
        success: boolean;
        data: {
            user: {
                id: number;
                nickname: string;
                email: string;
                studentId: string;
                department: string;
                dormitoryId: number;
                kakaoId: string;
                roomNumber: string;
                gender: import("../user/entities/user.entity").Gender;
                isNewUser: boolean;
            };
        };
    };
    private setCorsHeaders;
}
export {};
