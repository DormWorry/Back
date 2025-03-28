import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { KakaoTokenResponse, KakaoUserInfo } from './interfaces/kakao.interfaces';
export declare class AuthService {
    private readonly usersRepository;
    private readonly jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    findOrCreateUserByKakaoId(kakaoId: string, nickname: string, email?: string): Promise<User>;
    generateToken(user: User): {
        access_token: string;
    };
    getKakaoToken(code: string): Promise<KakaoTokenResponse>;
    getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo>;
    updateUserProfile(userId: number, profileData: any): Promise<User>;
}
