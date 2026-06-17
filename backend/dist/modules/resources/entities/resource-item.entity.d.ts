import { User } from '@modules/users/entities';
export declare class ResourceItem {
    id: string;
    title: string;
    subjectCode: string;
    year: string;
    semester: number;
    type: string;
    filePath: string;
    uploaderId: number;
    uploadedAt: Date;
    uploader: User;
}
