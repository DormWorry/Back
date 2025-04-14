import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    validate(payload: any): Promise<{
        id: number;
        kakaoId: string;
        nickname: string;
        isNewUser: boolean;
        dormitoryId: number;
        roomNumber: string;
    }>;
}
export {};
