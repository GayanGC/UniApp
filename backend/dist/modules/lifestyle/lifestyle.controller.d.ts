import { LifestyleService } from './lifestyle.service';
export declare class LifestyleController {
    private readonly lifestyleService;
    constructor(lifestyleService: LifestyleService);
    getMerchants(campusId: number): Promise<import("./entities/local-merchant.entity").LocalMerchant[]>;
    getEvents(campusId: number): Promise<import("./entities/campus-event.entity").CampusEvent[]>;
}
