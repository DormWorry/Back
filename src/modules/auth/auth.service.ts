import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findOrCreateUserByKakaoId(
    kakaoId: string,
    nickname: string,
    email?: string,
  ): Promise<User> {
    // 이메일로 사용자 검색 (카카오 계정 아이디를 이메일로 저장)
    let user = await this.usersRepository.findOne({ where: { email } });

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = this.usersRepository.create({
        email, // 카카오 계정의 이메일 저장
        nickname,
        isNewUser: true, // 새 사용자 표시 (추가 정보 입력 필요)
      });
      await this.usersRepository.save(user);
    }

    return user;
  }

  // JWT 토큰 생성
  generateToken(user: User): { access_token: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 사용자 정보 업데이트 (프로필 완성 후)
  async updateUserProfile(userId: number, profileData: any): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // 사용자 정보 업데이트
    Object.assign(user, { ...profileData, isNewUser: false });

    return this.usersRepository.save(user);
  }
}
