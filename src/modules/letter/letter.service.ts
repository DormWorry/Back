import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from './entities/letter.entity';
import { CreateLetterDto } from './dto/create-letter.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 사용자의 받은 편지함 목록 조회
  async getReceivedLetters(roomNumber: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [letters, total] = await this.letterRepository.findAndCount({
      where: { recipientRoomNumber: roomNumber },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // 익명 편지의 발신자 정보 숨기기
    const processedLetters = letters.map((letter) => {
      if (letter.isAnonymous) {
        return {
          ...letter,
          senderRoomNumber: null,
          senderName: '익명',
        };
      }
      return letter;
    });

    return {
      data: processedLetters,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 사용자의 보낸 편지함 목록 조회
  async getSentLetters(roomNumber: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [letters, total] = await this.letterRepository.findAndCount({
      where: { senderRoomNumber: roomNumber },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: letters,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 특정 편지 상세 조회
  async getLetterById(id: string, userRoomNumber: string) {
    const letter = await this.letterRepository.findOne({ where: { id } });
    
    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }
    
    // 발신자나 수신자만 편지를 볼 수 있음
    if (
      letter.senderRoomNumber !== userRoomNumber &&
      letter.recipientRoomNumber !== userRoomNumber
    ) {
      throw new ForbiddenException('해당 편지에 접근할 권한이 없습니다.');
    }
    
    // 읽음 상태 업데이트 (수신자가 조회한 경우)
    if (letter.recipientRoomNumber === userRoomNumber && !letter.isRead) {
      letter.isRead = true;
      await this.letterRepository.save(letter);
    }
    
    // 익명 편지인 경우, 수신자 조회 시 발신자 정보 숨김
    if (letter.isAnonymous && letter.recipientRoomNumber === userRoomNumber) {
      return {
        ...letter,
        senderRoomNumber: null,
        senderName: '익명',
      };
    }
    
    return letter;
  }

  // 편지 전송
  async createLetter(createLetterDto: CreateLetterDto, senderUserId: string) {
    try {
      // 수신자 ID 조회
      const recipient = await this.userRepository.findOne({
        where: { roomNumber: createLetterDto.recipientRoomNumber }
      });
      
      if (!recipient) {
        throw new NotFoundException(`방 번호 ${createLetterDto.recipientRoomNumber}에 해당하는 사용자를 찾을 수 없습니다.`);
      }
      
      // 새 편지 객체 생성
      const newLetter = new Letter();
      
      // DTO에서 값 복사
      newLetter.title = createLetterDto.title;
      newLetter.content = createLetterDto.content;
      newLetter.senderRoomNumber = createLetterDto.senderRoomNumber;
      newLetter.senderName = createLetterDto.senderName || '';
      newLetter.recipientRoomNumber = createLetterDto.recipientRoomNumber;
      newLetter.isAnonymous = createLetterDto.isAnonymous;
      
      // ID 설정 (Letter 엔티티에서는 string 타입으로 정의됨)
      newLetter.senderUserId = senderUserId;
      newLetter.recipientUserId = recipient.id.toString();
      newLetter.isRead = false;
      
      return this.letterRepository.save(newLetter);
    } catch (error) {
      console.error('편지 생성 오류:', error);
      throw error;
    }
  }
}
