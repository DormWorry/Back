import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RoommateProfileService } from './roommate-profile.service';
import { CreateRoommateProfileDto } from './dto/create-roommate-profile.dto';
import { UpdateRoommateProfileDto } from './dto/update-roommate-profile.dto';
import { FilterRoommateProfileDto } from './dto/filter-roommate-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roommate-profiles')
export class RoommateProfileController {
  constructor(
    private readonly roommateProfileService: RoommateProfileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createRoommateProfileDto: CreateRoommateProfileDto,
  ) {
    return this.roommateProfileService.create(
      req.user.id,
      createRoommateProfileDto,
    );
  }

  @Get()
  findAll(@Query() filterDto: FilterRoommateProfileDto) {
    const { preferredType, ...filters } = filterDto;

    if (Object.keys(filters).length) {
      return this.roommateProfileService.findWithFilters(
        filters,
        preferredType,
      );
    } else {
      return this.roommateProfileService.findAll(preferredType);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roommateProfileService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/me')
  findMyProfile(@Request() req) {
    return this.roommateProfileService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoommateProfileDto: UpdateRoommateProfileDto,
    @Request() req,
  ) {
    // 본인의 프로필인지 확인하는 로직이 필요하다면 여기에 추가
    return this.roommateProfileService.update(id, updateRoommateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // 본인의 프로필인지 확인하는 로직이 필요하다면 여기에 추가
    return this.roommateProfileService.remove(id);
  }
}
