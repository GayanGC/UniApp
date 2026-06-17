import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto';
export declare class ComplaintsController {
    private readonly complaintsService;
    constructor(complaintsService: ComplaintsService);
    createComplaint(userId: number, dto: CreateComplaintDto): Promise<import("./complaint.entity").Complaint>;
    getMyComplaints(userId: number): Promise<import("./complaint.entity").Complaint[]>;
    getAllComplaints(): Promise<import("./complaint.entity").Complaint[]>;
    updateComplaintStatus(id: string, dto: UpdateComplaintStatusDto): Promise<import("./complaint.entity").Complaint>;
}
