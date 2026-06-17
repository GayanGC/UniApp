import { Response } from 'express';
import { PastPapersService } from './past-papers.service';
import { UploadPastPaperDto, FilterPastPapersDto } from './dto';
export declare class PastPapersController {
    private readonly pastPapersService;
    constructor(pastPapersService: PastPapersService);
    upload(file: Express.Multer.File, uploadDto: UploadPastPaperDto, userId: number): Promise<{
        message: string;
        data: import("./entities").PastPaper;
    }>;
    findAll(filterDto: FilterPastPapersDto): Promise<{
        message: string;
        count: number;
        data: import("./entities").PastPaper[];
    }>;
    findOne(id: number): Promise<{
        message: string;
        data: import("./entities").PastPaper;
    }>;
    download(paperId: number, res: Response): Promise<void>;
    approve(id: number): Promise<{
        message: string;
        data: import("./entities").PastPaper;
    }>;
    remove(id: number): Promise<void>;
    getMyUploads(userId: number): Promise<{
        message: string;
        count: number;
        data: import("./entities").PastPaper[];
    }>;
    getStatistics(): Promise<{
        message: string;
        data: {
            total: number;
            approved: number;
            pending: number;
        };
    }>;
}
