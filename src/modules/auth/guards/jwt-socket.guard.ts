import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class JwtSocketGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token;

    if (!token) {
      throw new WsException('인증 토큰이 없습니다.');
    }

    try {
      // auth 서비스에서 토큰 검증 (실제 구현은 auth 서비스에 맞게 조정해야 함)
      // const user = await this.authService.verifyToken(token);
      // client.user = user;
      
      // 임시 검증 코드 (실제로는 토큰 검증 로직을 구현해야 함)
      const userId = client.handshake.auth.userId;
      if (!userId) {
        throw new WsException('유효하지 않은 사용자 ID');
      }
      
      return true;
    } catch (error) {
      throw new WsException('인증에 실패했습니다.');
    }
  }
}
