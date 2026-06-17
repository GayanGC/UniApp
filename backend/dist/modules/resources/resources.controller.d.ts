import { ResourcesService } from './resources.service';
import { UploadResourceDto, GetResourcesFilterDto } from './dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    uploadResource(uploadResourceDto: UploadResourceDto, userId: number, file: Express.Multer.File): Promise<import("./entities").ResourceItem>;
    getResources(filters: GetResourcesFilterDto): Promise<import("./entities").ResourceItem[]>;
}
