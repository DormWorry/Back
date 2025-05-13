import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any) {
    const kakaoId = profile.id.toString();
    const nickname = profile._json?.properties?.nickname || 'User';
    const email = profile._json?.kakao_account?.email;
    const profileImage = profile._json?.properties?.profile_image || null;
    const thumbnailImage = profile._json?.properties?.thumbnail_image || null;
    
    console.log('카카오 프로필 이미지:', profileImage);
    
    const user = await this.authService.findOrCreateUserByKakaoId(
      kakaoId,
      nickname,
      email,
      profileImage,
      thumbnailImage
    );
    
    return done(null, user);
  }
}
