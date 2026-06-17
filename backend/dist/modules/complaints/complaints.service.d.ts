import { Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
export declare class ComplaintsService {
    private readonly complaintRepository;
    private readonly notificationsGateway;
    constructor(complaintRepository: Repository<Complaint>, notificationsGateway: NotificationsGateway);
    createComplaint(studentId: number, dto: CreateComplaintDto): Promise<Complaint>;
    getStudentComplaints(studentId: number): Promise<Complaint[]>;
    getAllComplaints(): Promise<Complaint[]>;
    updateComplaintStatus(id: string, dto: UpdateComplaintStatusDto): Promise<Complaint>;
}
