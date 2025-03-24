import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOneBy({ id: payload.sub });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return { 
      id: user.id,
      kakaoId: user.kakaoId,
      nickname: user.nickname,
      isNewUser: user.isNewUser,
      dormitoryId: user.dormitoryId,
      roomNumber: user.roomNumber
    };
  }
}
