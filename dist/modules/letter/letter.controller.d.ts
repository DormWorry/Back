import { LetterService } from './letter.service';
import { CreateLetterDto } from './dto/create-letter.dto';
export declare class LetterController {
    private readonly letterService;
    constructor(letterService: LetterService);
    getReceivedLetters(req: any, page?: number, limit?: number): Promise<{
        data: (import("./entities/letter.entity").Letter | {
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
    getSentLetters(req: any, page?: number, limit?: number): Promise<{
        data: import("./entities/letter.entity").Letter[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLetterById(id: string, req: any): Promise<import("./entities/letter.entity").Letter | {
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
    createLetter(createLetterDto: CreateLetterDto): Promise<import("./entities/letter.entity").Letter>;
}
