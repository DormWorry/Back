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
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoommateProfileService } from './roommate-profile.service';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';
import { RoommateProfile } from './entities/roommate-profile.entity';

interface RequestWithUser {
  user: { id: string };
}

@Controller('roommate-profiles')
@UseGuards(AuthGuard('jwt'))
export class RoommateProfileController {
  constructor(
    private readonly roommateProfileService: RoommateProfileService,
  ) {}

  // 프로필 생성
  @Post()
  async create(
    @Req() req: RequestWithUser,
    @Body() createDto: CreateRoommateProfileDto,
  ): Promise<{ success: boolean; data: RoommateProfile }> {
    try {
      const userId = req.user.id.toString();
      const profile = await this.roommateProfileService.create(
        userId,
        createDto,
      );

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '룸메이트 프로필 생성 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 모든 프로필 조회 (필터링 가능)
  @Get()
  async findAll(
    @Query('isActive') isActive?: string,
    @Query('dormitoryId') dormitoryId?: string,
    @Query('gender') gender?: string,
    @Query('preferredPersonalityTypeId') preferredPersonalityTypeId?: string,
  ): Promise<{ success: boolean; data: RoommateProfile[] }> {
    try {
      const options: any = {};

      if (isActive !== undefined) {
        options.isActive = isActive === 'true';
      }

      if (dormitoryId) {
        options.dormitoryId = parseInt(dormitoryId, 10);
      }

      if (gender) {
        options.gender = gender;
      }

      if (preferredPersonalityTypeId) {
        options.preferredPersonalityTypeId = parseInt(
          preferredPersonalityTypeId,
          10,
        );
      }

      const profiles = await this.roommateProfileService.findAll(options);

      return {
        success: true,
        data: profiles,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '룸메이트 프로필 조회 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 내가 원하는 타입과 일치하는 프로필 조회
  @Get('matching')
  async findMatchingProfiles(
    @Req() req: RequestWithUser,
    @Query('isActive') isActive?: string,
    @Query('dormitoryId') dormitoryId?: string,
    @Query('gender') gender?: string,
  ): Promise<{ success: boolean; data: RoommateProfile[] }> {
    try {
      const userId = req.user.id.toString();
      const options: any = {};

      if (isActive !== undefined) {
        options.isActive = isActive === 'true';
      }

      if (dormitoryId) {
        options.dormitoryId = parseInt(dormitoryId, 10);
      }

      if (gender) {
        options.gender = gender;
      }

      const profiles = await this.roommateProfileService.findMatchingProfiles(
        userId,
        options,
      );

      return {
        success: true,
        data: profiles,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '매칭 프로필 조회 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 특정 프로필 조회
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: RoommateProfile }> {
    try {
      const profile = await this.roommateProfileService.findOne(id);

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '룸메이트 프로필 조회 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 내 프로필 조회
  @Get('user/me')
  async findMyProfile(
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; data: RoommateProfile }> {
    try {
      const userId = req.user.id.toString();
      const profile = await this.roommateProfileService.findByUserId(userId);

      return {
        success: true,
        data: profile,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '사용자 프로필 조회 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 프로필 업데이트
  @Patch()
  async update(
    @Req() req: RequestWithUser,
    @Body() updateDto: UpdateRoommateProfileDto,
  ): Promise<{ success: boolean; data: RoommateProfile }> {
    try {
      const userId = req.user.id.toString();
      const updatedProfile = await this.roommateProfileService.update(
        userId,
        updateDto,
      );

      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '룸메이트 프로필 업데이트 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }

  // 프로필 삭제
  @Delete()
  async remove(
    @Req() req: RequestWithUser,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const userId = req.user.id.toString();
      await this.roommateProfileService.remove(userId);

      return {
        success: true,
        message: '룸메이트 프로필이 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '룸메이트 프로필 삭제 중 오류가 발생했습니다.';
      const errorStatus =
        error instanceof HttpException
          ? error.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      throw new HttpException(errorMessage, errorStatus);
    }
  }
}
