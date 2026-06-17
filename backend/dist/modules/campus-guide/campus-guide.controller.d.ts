import { CampusGuideService } from './campus-guide.service';
import { CreateCampusDto, CreatePOIDto } from './dto';
export declare class CampusGuideController {
    private readonly campusGuideService;
    constructor(campusGuideService: CampusGuideService);
    createCampus(createCampusDto: CreateCampusDto): Promise<{
        message: string;
        data: import("./entities").Campus;
    }>;
    createPOI(createPOIDto: CreatePOIDto): Promise<{
        message: string;
        data: import("./entities").CampusPOI;
    }>;
    getAllCampuses(): Promise<{
        message: string;
        count: number;
        data: import("./entities").Campus[];
    }>;
    getAllCampusesWithPOIs(): Promise<{
        message: string;
        count: number;
        data: import("./entities").Campus[];
    }>;
    getCampusById(id: number): Promise<{
        message: string;
        data: import("./entities").Campus;
    }>;
    getPOIsByCampus(campusId: number): Promise<{
        message: string;
        count: number;
        data: import("./entities").CampusPOI[];
    }>;
    getPOIsByCategory(category: string): Promise<{
        message: string;
        count: number;
        data: import("./entities").CampusPOI[];
    }>;
    deleteCampus(id: number): Promise<void>;
    deletePOI(id: number): Promise<void>;
}
