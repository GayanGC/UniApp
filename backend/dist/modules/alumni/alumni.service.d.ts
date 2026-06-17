import { Repository } from 'typeorm';
import { AlumniFeed } from './entities/alumni-feed.entity';
export declare class AlumniService {
    private readonly feedRepository;
    constructor(feedRepository: Repository<AlumniFeed>);
    getFeed(): Promise<AlumniFeed[]>;
}
