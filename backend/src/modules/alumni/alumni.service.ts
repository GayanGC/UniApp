import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlumniFeed } from './entities/alumni-feed.entity';

@Injectable()
export class AlumniService {
  constructor(
    @InjectRepository(AlumniFeed)
    private readonly feedRepository: Repository<AlumniFeed>,
  ) {}

  async getFeed(): Promise<AlumniFeed[]> {
    return await this.feedRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
