import { AlumniService } from './alumni.service';
export declare class AlumniController {
    private readonly alumniService;
    constructor(alumniService: AlumniService);
    getFeed(): Promise<import("./entities/alumni-feed.entity").AlumniFeed[]>;
}
