import { IsString, IsNotEmpty } from 'class-validator';

export class KakaoTokenExchangeDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
