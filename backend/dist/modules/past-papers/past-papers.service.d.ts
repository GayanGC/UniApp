import { Repository } from 'typeorm';
import { PastPaper } from './entities';
import { UploadPastPaperDto, FilterPastPapersDto } from './dto';
export declare class PastPapersService {
    private readonly pastPaperRepository;
    constructor(pastPaperRepository: Repository<PastPaper>);
    upload(uploadDto: UploadPastPaperDto, filePath: string, userId: number): Promise<PastPaper>;
    findAll(filterDto: FilterPastPapersDto): Promise<PastPaper[]>;
    findOne(paperId: number): Promise<PastPaper>;
    approve(paperId: number): Promise<PastPaper>;
    remove(paperId: number): Promise<void>;
    findByUploader(userId: number): Promise<PastPaper[]>;
    getStatistics(): Promise<{
        total: number;
        approved: number;
        pending: number;
    }>;
}
