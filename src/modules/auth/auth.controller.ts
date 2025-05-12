import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  HttpException,
  Options,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';

// Gender enum 직접 정의
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

// ProfileUpdateDto 직접 정의
export class ProfileUpdateDto {
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

// KakaoTokenExchangeDto 직접 정의
export class KakaoTokenExchangeDto {
  code: string;
  redirectUri?: string;
}

// 요청 객체 타입 정의
interface RequestWithUser extends Request {
  user: User;
}

// 프로필 업데이트 DTO
// interface ProfileUpdateDto {
//   nickname: string;
//   studentId: string;
//   department: string;
//   dormitoryId: string;
//   roomNumber: string;
//   gender: string;
//   kakaoId?: string;
// }

// 카카오 토큰 교환 DTO
// interface KakaoTokenExchangeDto {
//   code: string;
// }

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
    const redirectUrl = `${frontendUrl}/auth/callback?token=${token.access_token}&isNewUser=${user.isNewUser}&kakaoId=${user.kakaoId}`;

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
      console.log('카카오 토큰 교환 요청 받음');
      // 디버깅용 - 민감한 정보는 일부만 표시
      console.log('코드 앞 10자:', body.code.substring(0, 10) + '...');
      console.log('Origin 헤더:', res.req.headers.origin);

      const { code, redirectUri } = body;

      if (!code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: '인증 코드가 제공되지 않았습니다.',
        });
      }

      console.log('프론트엔드에서 전달받은 redirectUri:', redirectUri);

      // 카카오 API와 코드 교환 (전달받은 redirectUri 사용)
      const kakaoToken = await this.authService.getKakaoToken(
        code,
        redirectUri,
      );

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
            kakaoId: user.kakaoId, // kakaoId 추가
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
        roomNumber: user.roomNumber,
        gender: user.gender,
      },
    };
  }

  // 프로필 업데이트 (신규 사용자가 추가 정보 입력 후)
  @Post('profile/create')
  async updateProfile(
    @Body() profileData: ProfileUpdateDto,
    @Res() res: Response,
  ) {
    try {
      // CORS 헤더 설정
      this.setCorsHeaders(res);

      // 디버깅을 위한 요청 데이터 로깅
      console.log('프로필 업데이트 요청 데이터:', profileData);

      // dormitoryId 처리 - 유효하지 않은 값이면 제거
      if (profileData.dormitoryId !== undefined) {
        // 문자열로 들어온 경우 숫자로 변환 (클라이언트에서 문자열로 보낼 수 있음)
        const dormitoryIdNum =
          typeof profileData.dormitoryId === 'string'
            ? Number(profileData.dormitoryId)
            : profileData.dormitoryId;

        // 유효한 dormitoryId 값인지 확인 (1~3 사이의 값만 유효)
        if (isNaN(dormitoryIdNum) || dormitoryIdNum < 1 || dormitoryIdNum > 3) {
          console.log(
            '유효하지 않은 dormitoryId 값이 제거되었습니다:',
            profileData.dormitoryId,
          );
          // 유효하지 않은 값이면 객체에서 속성 자체를 제거
          const { dormitoryId, ...restData } = profileData;
          profileData = restData as ProfileUpdateDto;
        } else {
          // 유효한 값이면 숫자로 변환하여 저장
          profileData.dormitoryId = dormitoryIdNum;
        }
      }

      // kakaoId를 저장
      const kakaoId = profileData.kakaoId;
      if (!kakaoId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'kakaoId가 필요합니다',
        });
      }

      // kakaoId로 사용자 찾기
      const updatedUser = await this.authService.updateUserProfileByKakaoId(
        kakaoId,
        profileData,
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            nickname: updatedUser.nickname,
            email: updatedUser.email,
            studentId: updatedUser.studentId,
            department: updatedUser.department,
            dormitoryId: updatedUser.dormitoryId,
            kakaoId: updatedUser.kakaoId,
            roomNumber: updatedUser.roomNumber,
            gender: updatedUser.gender,
            isNewUser: updatedUser.isNewUser,
          },
        },
      });
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '프로필 업데이트 중 오류가 발생했습니다.';
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
          kakaoId: user.kakaoId,
          roomNumber: user.roomNumber,
          gender: user.gender,
          isNewUser: user.isNewUser,
        },
      },
    };
  }

  // CORS 헤더 설정 메서드
  private setCorsHeaders(res: Response) {
    const origin = res.req.headers.origin as string;

    // 허용된 출처 목록
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://capstone-front-nu.vercel.app',
      'https://capstone-front-c90869183-kwon-dohuns-projects.vercel.app',
    ];

    // 요청 출처가 있으면 항상 해당 출처 허용 (CORS 문제 해결)
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      // credentials 사용 시 필요
      res.header('Access-Control-Allow-Credentials', 'true');
    } else {
      // 출처가 없는 경우 (서버 간 통신 등)
      res.header('Access-Control-Allow-Origin', '*');
    }

    // 필요한 헤더와 메서드 설정
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    // preflight 요청 캐싱 설정 (성능 향상)
    res.header('Access-Control-Max-Age', '86400'); // 24시간

    console.log('CORS 헤더 설정:', {
      origin: res.getHeader('Access-Control-Allow-Origin'),
      methods: res.getHeader('Access-Control-Allow-Methods'),
      credentials: res.getHeader('Access-Control-Allow-Credentials'),
    });
  }
}
