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
import { ProfileUpdateDto } from './auth.controller';

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
  async getKakaoToken(
    code: string,
    redirectUri?: string,
  ): Promise<KakaoTokenResponse> {
    // 환경 변수 유효성 검사
    const clientId = process.env.KAKAO_CLIENT_ID;
    // 요청에서 제공한 redirectUri 사용 또는 환경 변수에서 가져오기
    const callbackUrl = redirectUri || process.env.KAKAO_CALLBACK_URL;

    if (!clientId) {
      console.error('KAKAO_CLIENT_ID 환경 변수가 설정되지 않았습니다.');
      throw new Error('카카오 인증 설정이 올바르지 않습니다. (Client ID 누락)');
    }

    if (!callbackUrl) {
      console.error('KAKAO_CALLBACK_URL 환경 변수가 설정되지 않았습니다.');
      throw new Error(
        '카카오 인증 설정이 올바르지 않습니다. (Callback URL 누락)',
      );
    }
    
    console.log(`사용할 리다이렉트 URI: ${callbackUrl}`);
    
    try {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', clientId);
      params.append('redirect_uri', callbackUrl); // 사용자가 제공한 리다이렉트 URI 사용
      params.append('code', code);

      console.log(`카카오 토큰 교환 시도: redirect_uri=${callbackUrl}`);

      const response = await axios.post<KakaoTokenResponse>(
        tokenUrl,
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      console.log('카카오 토큰 교환 성공');
      return response.data;
    } catch (error) {
      let errorMessage = '카카오 토큰 교환 중 오류가 발생했습니다.';
      let errorDetails = '';

      if (error instanceof AxiosError) {
        errorDetails = JSON.stringify(error.response?.data || {});
        console.error(
          '카카오 토큰 교환 실패 (AxiosError):',
          `Status: ${error.response?.status}, Data: ${errorDetails}`,
        );

        // 구체적인 오류 메시지 제공
        if (error.response?.status === 400) {
          errorMessage = '카카오 인증 코드가 유효하지 않거나 만료되었습니다.';
        } else if (error.response?.status === 401) {
          errorMessage = '카카오 인증에 실패했습니다. Client ID를 확인하세요.';
        }
      } else if (error instanceof Error) {
        errorDetails = error.message;
        console.error('카카오 토큰 교환 실패 (Error):', errorDetails);
      } else {
        console.error('카카오 토큰 교환 실패 (Unknown):', error);
      }

      throw new Error(`${errorMessage} (세부 정보: ${errorDetails})`);
    }
  }

  // 카카오 사용자 정보 조회
  async getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
    try {
      const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
      console.log('카카오 사용자 정보 조회 시도');
      const response = await axios.get<KakaoUserInfo>(userInfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('카카오 사용자 정보 조회 성공:', response.data.id);
      return response.data;
    } catch (error) {
      let errorMessage = '카카오 사용자 정보 조회 중 오류가 발생했습니다.';
      let errorDetails = '';

      if (error instanceof AxiosError) {
        errorDetails = JSON.stringify(error.response?.data || {});
        console.error(
          '카카오 사용자 정보 조회 실패 (AxiosError):',
          `Status: ${error.response?.status}, Data: ${errorDetails}`,
        );
        if (error.response?.status === 401) {
          errorMessage = '액세스 토큰이 유효하지 않습니다.';
        }
      } else if (error instanceof Error) {
        errorDetails = error.message;
        console.error('카카오 사용자 정보 조회 실패 (Error):', errorDetails);
      } else {
        console.error('카카오 사용자 정보 조회 실패 (Unknown):', error);
      }
      throw new Error(`${errorMessage} (세부 정보: ${errorDetails})`);
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

  // kakaoId로 사용자 찾아 프로필 업데이트
  async updateUserProfileByKakaoId(
    kakaoId: string,
    profileData: ProfileUpdateDto,
  ): Promise<User> {
    // kakaoId로 사용자 검색
    const user = await this.usersRepository.findOne({ where: { kakaoId } });

    if (!user) {
      throw new Error(
        `KakaoId ${kakaoId}에 해당하는 사용자를 찾을 수 없습니다.`,
      );
    }

    // 프로필 데이터에서 dormitoryId가 있는 경우에만 포함
    const updateData = { ...profileData, isNewUser: false };
    
    // dormitoryId가 없거나 0이면 해당 필드 제거
    if (
      updateData.dormitoryId === undefined ||
      updateData.dormitoryId === null ||
      updateData.dormitoryId === 0
    ) {
      delete updateData.dormitoryId;
    }

    // 사용자 정보 업데이트
    Object.assign(user, updateData);

    return this.usersRepository.save(user);
  }
}
