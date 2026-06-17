import { Repository } from 'typeorm';
import { LocalMerchant } from './entities/local-merchant.entity';
import { CampusEvent } from './entities/campus-event.entity';
export declare class LifestyleService {
    private readonly merchantRepository;
    private readonly eventRepository;
    constructor(merchantRepository: Repository<LocalMerchant>, eventRepository: Repository<CampusEvent>);
    getMerchantsByCampus(campusId: number): Promise<LocalMerchant[]>;
    getEventsByCampus(campusId: number): Promise<CampusEvent[]>;
}
