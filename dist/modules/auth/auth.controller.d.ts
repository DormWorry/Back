import { AuthService } from './auth.service';
import { Response } from 'express';
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
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    kakaoLogin(): void;
    kakaoCallback(req: RequestWithUser, res: Response): void;
    updateProfile(req: RequestWithUser, profileData: ProfileUpdateDto): Promise<{
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
    }>;
    getProfile(req: RequestWithUser): User;
}
export {};
