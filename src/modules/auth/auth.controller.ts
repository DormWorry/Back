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
  Options,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
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

  // 모든 경로에 대한 OPTIONS 요청 처리
  @Options('*')
  handleOptions(@Res() res: Response) {
    this.setCorsHeaders(res);
    return res.sendStatus(204);
  }

  // 카카오 토큰 엔드포인트에 대한 OPTIONS 요청 특별 처리
  @Options('kakao/token')
  handleKakaoTokenOptions(@Res() res: Response) {
    this.setCorsHeaders(res);
    return res.sendStatus(204);
  }

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
  async exchangeKakaoToken(
    @Body() body: KakaoTokenExchangeDto,
    @Res() res: Response,
  ) {
    // CORS 헤더 설정
    this.setCorsHeaders(res);

    try {
      console.log('카카오 토큰 교환 요청 받음, 코드:', body.code); // 디버깅용
      console.log('요청 헤더:', res.req.headers); // 요청 헤더 디버깅

      const { code } = body;

      if (!code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: '인증 코드가 제공되지 않았습니다.',
        });
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

      return res.status(HttpStatus.OK).json({
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
      });
    } catch (error) {
      console.error('카카오 토큰 교환 오류:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '카카오 로그인 처리 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      // 오류 응답에도 CORS 헤더 설정
      this.setCorsHeaders(res);
      return res.status(errorStatus).json({
        success: false,
        message: errorMessage,
      });
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

  // CORS 헤더 설정 메서드
  private setCorsHeaders(res: Response) {
    // 개발 환경에서는 localhost:3000을 허용
    const allowedOrigins = ['http://localhost:3000'];
    const origin = res.req.headers.origin;
    const allowedOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
  }
}
