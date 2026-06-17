import { Campus } from '@modules/campus-guide/entities/campus.entity';
export declare class CampusEvent {
    id: string;
    title: string;
    description: string;
    date: Date;
    registrationLink: string;
    campusId: number;
    campus: Campus;
}
