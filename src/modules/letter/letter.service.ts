import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter } from './entities/letter.entity';
import { CreateLetterDto } from './dto/create-letter.dto';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private letterRepository: Repository<Letter>,
  ) {}

  // 사용자의 받은 편지함 목록 조회
  async getReceivedLetters(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [letters, total] = await this.letterRepository.findAndCount({
      where: { recipientUserId: userId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // 익명 편지의 발신자 정보 숨기기
    const processedLetters = letters.map((letter) => {
      if (letter.isAnonymous) {
        return {
          ...letter,
          senderUserId: null,
          senderRoomNumber: null,
          senderName: '익명',
          sender: null,
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

  // 사용자의 즐겨찾기 편지함 목록 조회
  async getFavoriteLetters(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [letters, total] = await this.letterRepository.findAndCount({
      where: {
        recipientUserId: userId,
        isFavorite: true,
      },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // 익명 편지의 발신자 정보 숨기기
    const processedLetters = letters.map((letter) => {
      if (letter.isAnonymous) {
        return {
          ...letter,
          senderUserId: null,
          senderRoomNumber: null,
          senderName: '익명',
          sender: null,
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
  async getSentLetters(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [letters, total] = await this.letterRepository.findAndCount({
      where: { senderUserId: userId },
      relations: ['recipient'],
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
  async getLetterById(id: string, userId: string) {
    const letter = await this.letterRepository.findOne({
      where: { id },
      relations: ['sender', 'recipient', 'originalLetter'],
    });

    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    // 발신자나 수신자만 편지를 볼 수 있음
    if (letter.senderUserId !== userId && letter.recipientUserId !== userId) {
      throw new ForbiddenException('해당 편지에 접근할 권한이 없습니다.');
    }

    // 읽음 상태 업데이트 (수신자가 조회한 경우)
    if (letter.recipientUserId === userId && !letter.isRead) {
      letter.isRead = true;
      await this.letterRepository.save(letter);
    }

    // 익명 편지인 경우, 수신자 조회 시 발신자 정보 숨김
    if (letter.isAnonymous && letter.recipientUserId === userId) {
      return {
        ...letter,
        senderUserId: null,
        senderRoomNumber: null,
        senderName: '익명',
        sender: null,
      };
    }

    return letter;
  }

  // 편지 전송
  async createLetter(createLetterDto: CreateLetterDto) {
    const newLetter = this.letterRepository.create(createLetterDto);
    return this.letterRepository.save(newLetter);
  }

  // 답장 보내기
  async replyToLetter(
    originalLetterId: string,
    createLetterDto: CreateLetterDto,
  ) {
    // 원본 편지 확인
    const originalLetter = await this.letterRepository.findOne({
      where: { id: originalLetterId },
    });

    if (!originalLetter) {
      throw new NotFoundException('원본 편지를 찾을 수 없습니다.');
    }

    // 답장은 원본 편지의 수신자만 보낼 수 있음
    if (originalLetter.recipientUserId !== createLetterDto.senderUserId) {
      throw new ForbiddenException('해당 편지에 답장을 보낼 권한이 없습니다.');
    }

    // 원본 편지의 발신자를 답장의 수신자로 설정
    const replyLetter = this.letterRepository.create({
      ...createLetterDto,
      recipientUserId: originalLetter.senderUserId,
      recipientRoomNumber: originalLetter.senderRoomNumber,
      originalLetterId: originalLetterId,
    });

    return this.letterRepository.save(replyLetter);
  }

  // 편지 즐겨찾기 설정/해제
  async toggleFavorite(id: string, userId: string) {
    const letter = await this.letterRepository.findOne({ where: { id } });

    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    // 수신자만 즐겨찾기 설정 가능
    if (letter.recipientUserId !== userId) {
      throw new ForbiddenException('해당 편지를 즐겨찾기할 권한이 없습니다.');
    }

    // 즐겨찾기 상태 토글
    letter.isFavorite = !letter.isFavorite;

    await this.letterRepository.save(letter);

    return { isFavorite: letter.isFavorite };
  }

  // 편지 삭제
  async deleteLetter(id: string, userId: string) {
    const letter = await this.letterRepository.findOne({ where: { id } });

    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    // 발신자나 수신자만 편지 삭제 가능
    if (letter.senderUserId !== userId && letter.recipientUserId !== userId) {
      throw new ForbiddenException('해당 편지를 삭제할 권한이 없습니다.');
    }

    await this.letterRepository.remove(letter);

    return { success: true, message: '편지가 삭제되었습니다.' };
  }
}
