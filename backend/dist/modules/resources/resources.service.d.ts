import { Repository } from 'typeorm';
import { ResourceItem } from './entities';
import { UploadResourceDto, GetResourcesFilterDto } from './dto';
export declare class ResourcesService {
    private readonly resourceRepository;
    constructor(resourceRepository: Repository<ResourceItem>);
    uploadResource(uploaderId: number, dto: UploadResourceDto, filePath: string): Promise<ResourceItem>;
    findAllWithFilters(filters: GetResourcesFilterDto): Promise<ResourceItem[]>;
}
