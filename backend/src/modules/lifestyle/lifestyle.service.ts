import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocalMerchant } from './entities/local-merchant.entity';
import { CampusEvent } from './entities/campus-event.entity';

@Injectable()
export class LifestyleService {
  constructor(
    @InjectRepository(LocalMerchant)
    private readonly merchantRepository: Repository<LocalMerchant>,
    @InjectRepository(CampusEvent)
    private readonly eventRepository: Repository<CampusEvent>,
  ) {}

  async getMerchantsByCampus(campusId: number): Promise<LocalMerchant[]> {
    return await this.merchantRepository.find({ where: { campusId } });
  }

  async getEventsByCampus(campusId: number): Promise<CampusEvent[]> {
    return await this.eventRepository.find({
      where: { campusId },
      order: { date: 'ASC' },
    });
  }
}
