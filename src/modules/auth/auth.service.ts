import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import axios, { AxiosError } from 'axios';
import {
  KakaoTokenResponse,
  KakaoUserInfo,
} from './interfaces/kakao.interfaces';
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
    // 카카오 아이디로 사용자 검색
    let user = await this.usersRepository.findOne({ where: { kakaoId } });

    // 이메일로 사용자 검색 (카카오 아이디가 없는 경우)
    if (!user && email) {
      user = await this.usersRepository.findOne({ where: { email } });
    }

    // 사용자가 없으면 새로 생성
    if (!user) {
      user = this.usersRepository.create({
        kakaoId,
        email,
        nickname,
        isNewUser: true, // 새 사용자 표시 (추가 정보 입력 필요)
      });
      await this.usersRepository.save(user);
    } else if (!user.kakaoId) {
      // 기존 사용자에 카카오 아이디 연결
      user.kakaoId = kakaoId;
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

  // 카카오 인증 코드를 토큰으로 교환
  async getKakaoToken(code: string): Promise<KakaoTokenResponse> {
    try {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', process.env.KAKAO_CLIENT_ID || '');
      params.append('redirect_uri', process.env.KAKAO_CALLBACK_URL || '');
      params.append('code', code);
      const response = await axios.post<KakaoTokenResponse>(
        tokenUrl,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        '카카오 토큰 교환 오류:',
        error instanceof AxiosError
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : '알 수 없는 오류',
      );
      throw new Error('카카오 토큰 교환 중 오류가 발생했습니다.');
    }
  }

  // 카카오 사용자 정보 조회
  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      const response = await axios.get<KakaoUserInfo>(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        '카카오 사용자 정보 조회 오류:',
        error instanceof AxiosError
          ? error.response?.data
          : error instanceof Error
            ? error.message
            : '알 수 없는 오류',
      );
      throw new Error('카카오 사용자 정보 조회 중 오류가 발생했습니다.');
    }
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
