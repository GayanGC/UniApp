import { Repository } from 'typeorm';
import { Campus, CampusPOI } from './entities';
import { CreateCampusDto, CreatePOIDto } from './dto';
export declare class CampusGuideService {
    private readonly campusRepository;
    private readonly poiRepository;
    constructor(campusRepository: Repository<Campus>, poiRepository: Repository<CampusPOI>);
    createCampus(createCampusDto: CreateCampusDto): Promise<Campus>;
    createPOI(createPOIDto: CreatePOIDto): Promise<CampusPOI>;
    getAllCampuses(): Promise<Campus[]>;
    getCampusById(campusId: number): Promise<Campus>;
    getPOIsByCampus(campusId: number): Promise<CampusPOI[]>;
    getAllCampusesWithPOIs(): Promise<Campus[]>;
    updateCampus(campusId: number, updateData: Partial<CreateCampusDto>): Promise<Campus>;
    deleteCampus(campusId: number): Promise<void>;
    deletePOI(poiId: number): Promise<void>;
    getPOIsByCategory(category: string): Promise<CampusPOI[]>;
}
