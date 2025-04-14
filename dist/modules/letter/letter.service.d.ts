import { Repository } from 'typeorm';
import { Letter } from './entities/letter.entity';
import { CreateLetterDto } from './dto/create-letter.dto';
import { User } from '../user/entities/user.entity';
export declare class LetterService {
    private letterRepository;
    private userRepository;
    constructor(letterRepository: Repository<Letter>, userRepository: Repository<User>);
    getReceivedLetters(roomNumber: string, page?: number, limit?: number): Promise<{
        data: (Letter | {
            senderRoomNumber: null;
            senderName: string;
            id: string;
            title: string;
            content: string;
            senderUserId: string;
            recipientUserId: string;
            recipientRoomNumber: string;
            isAnonymous: boolean;
            isRead: boolean;
            createdAt: Date;
            updatedAt: Date;
            sender: User;
            recipient: User;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getSentLetters(roomNumber: string, page?: number, limit?: number): Promise<{
        data: Letter[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLetterById(id: string, userRoomNumber: string): Promise<Letter | {
        senderRoomNumber: null;
        senderName: string;
        id: string;
        title: string;
        content: string;
        senderUserId: string;
        recipientUserId: string;
        recipientRoomNumber: string;
        isAnonymous: boolean;
        isRead: boolean;
        createdAt: Date;
        updatedAt: Date;
        sender: User;
        recipient: User;
    }>;
    createLetter(createLetterDto: CreateLetterDto, senderUserId: string): Promise<Letter>;
}
