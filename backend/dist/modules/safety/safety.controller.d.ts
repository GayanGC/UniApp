import { SafetyService } from './safety.service';
import { CreateAnonymousComplaintDto } from './dto/create-anonymous-complaint.dto';
export declare class SafetyController {
    private readonly safetyService;
    constructor(safetyService: SafetyService);
    submitAnonymousComplaint(dto: CreateAnonymousComplaintDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
