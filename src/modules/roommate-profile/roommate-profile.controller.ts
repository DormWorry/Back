import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoommateProfileService } from './roommate-profile.service';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '../user/entities/user.entity';

// 요청에 사용자 정보를 포함하는 인터페이스 정의
interface RequestWithUser extends Request {
  user: User;
}

@Controller('roommate-profiles')
export class RoommateProfileController {
  constructor(
    private readonly roommateProfileService: RoommateProfileService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createRoommateProfileDto: CreateRoommateProfileDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = String(req.user.id); // 명시적으로 string으로 변환
    return await this.roommateProfileService.create(
      userId,
      createRoommateProfileDto,
    );
  }

  @Get()
  async findAll(
    @Query('myPersonalityTypeId') myPersonalityTypeId?: number,
    @Query('preferredPersonalityTypeId') preferredPersonalityTypeId?: number,
    @Query('dormitoryId') dormitoryId?: string,
  ) {
    return await this.roommateProfileService.findAll({
      myPersonalityTypeId: myPersonalityTypeId 
        ? +myPersonalityTypeId 
        : undefined,
      preferredPersonalityTypeId: preferredPersonalityTypeId 
        ? +preferredPersonalityTypeId 
        : undefined,
      dormitoryId,
    });
  }

  @Get('user/me')
  @UseGuards(AuthGuard('jwt'))
  async findMyProfile(@Req() req: RequestWithUser) {
    const userId = String(req.user.id); // 명시적으로 string으로 변환
    const profile = await this.roommateProfileService.findByUserId(userId);

    if (!profile) {
      throw new HttpException(
        'Profile not found for current user',
        HttpStatus.NOT_FOUND,
      );
    }

    return profile;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const profile = await this.roommateProfileService.findOne(id);
    
    if (!profile) {
      throw new HttpException(
        `Profile with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    
    return profile;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') id: string,
    @Body() updateRoommateProfileDto: UpdateRoommateProfileDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = String(req.user.id); // 명시적으로 string으로 변환
    const profile = await this.roommateProfileService.findOne(id);
    
    if (!profile) {
      throw new HttpException(
        'Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (profile.userId !== userId) {
      throw new HttpException(
        'You do not have permission to update this profile',
        HttpStatus.FORBIDDEN,
      );
    }
    
    return await this.roommateProfileService.update(
      id,
      updateRoommateProfileDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = String(req.user.id); // 명시적으로 string으로 변환
    const profile = await this.roommateProfileService.findOne(id);
    
    if (!profile) {
      throw new HttpException(
        'Profile not found',
        HttpStatus.NOT_FOUND,
      );
    }

    if (profile.userId !== userId) {
      throw new HttpException(
        'You do not have permission to delete this profile',
        HttpStatus.FORBIDDEN,
      );
    }
    
    return await this.roommateProfileService.remove(id);
  }
}
