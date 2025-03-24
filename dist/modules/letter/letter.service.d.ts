import { Repository } from 'typeorm';
import { Letter } from './entities/letter.entity';
import { CreateLetterDto } from './dto/create-letter.dto';
export declare class LetterService {
    private letterRepository;
    constructor(letterRepository: Repository<Letter>);
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
            sender: import("../user/entities/user.entity").User;
            recipient: import("../user/entities/user.entity").User;
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
        sender: import("../user/entities/user.entity").User;
        recipient: import("../user/entities/user.entity").User;
    }>;
    createLetter(createLetterDto: CreateLetterDto): Promise<Letter>;
}
