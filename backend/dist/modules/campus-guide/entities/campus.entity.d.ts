import { CampusPOI } from './campus-poi.entity';
export declare class Campus {
    campusId: number;
    name: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    pois: CampusPOI[];
}
