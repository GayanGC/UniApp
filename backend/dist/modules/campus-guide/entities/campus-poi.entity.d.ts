import { Campus } from './campus.entity';
export declare class CampusPOI {
    poiId: number;
    campusId: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    campus: Campus;
}
