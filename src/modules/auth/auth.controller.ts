import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { User } from '../user/entities/user.entity';

// 요청 객체 타입 정의
interface RequestWithUser extends Request {
  user: User;
}

// 프로필 업데이트 DTO
interface ProfileUpdateDto {
  nickname: string;
  studentId: string;
  department: string;
  dormitoryId: string;
  roomNumber: string;
  gender: string;
  kakaoId?: string;
}

// 카카오 토큰 교환 DTO
interface KakaoTokenExchangeDto {
  code: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 카카오 로그인 시작
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    // kakao strategy가 처리
    return;
  }

  // 카카오 로그인 콜백
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  kakaoCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user;
    const token = this.authService.generateToken(user);

    // 프론트엔드 앱으로 리다이렉트 (토큰과 신규 사용자 여부 전달)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token.access_token}&isNewUser=${user.isNewUser}`;

    return res.redirect(redirectUrl);
  }

  // 프론트엔드에서 카카오 인증 코드를 받아 토큰으로 교환
  @Post('kakao/token')
  async exchangeKakaoToken(@Body() body: KakaoTokenExchangeDto) {
    try {
      const { code } = body;

      if (!code) {
        throw new HttpException(
          '인증 코드가 필요합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 카카오 API와 코드 교환
      const kakaoToken = await this.authService.getKakaoToken(code);

      // 카카오 사용자 정보 조회
      const kakaoUser = await this.authService.getKakaoUserInfo(
        kakaoToken.access_token,
      );

      // 사용자 찾기 또는 생성
      const user = await this.authService.findOrCreateUserByKakaoId(
        String(kakaoUser.id),
        kakaoUser.properties.nickname,
        kakaoUser.kakao_account?.email,
      );

      // JWT 토큰 생성
      const token = this.authService.generateToken(user);

      return {
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
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '카카오 로그인 처리 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 카카오 로그인 상태 확인 (프론트엔드에서 사용)
  @Get('kakao/status')
  @UseGuards(AuthGuard('jwt'))
  getKakaoLoginStatus(@Req() req: RequestWithUser) {
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

  // 프로필 업데이트 (신규 사용자가 추가 정보 입력 후)
  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() profileData: ProfileUpdateDto,
  ) {
    try {
      const userId = req.user.id;
      const updatedUser = await this.authService.updateUserProfile(
        userId,
        profileData,
      );

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
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '프로필 업데이트 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 현재 로그인한 사용자 정보 조회
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: RequestWithUser) {
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
}
