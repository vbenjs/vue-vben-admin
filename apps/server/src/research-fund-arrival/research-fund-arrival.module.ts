import { Module } from '@nestjs/common';

import { ResearchFundArrivalController } from './research-fund-arrival.controller';
import { ResearchFundArrivalService } from './research-fund-arrival.service';

@Module({
  controllers: [ResearchFundArrivalController],
  providers: [ResearchFundArrivalService],
})
export class ResearchFundArrivalModule {}
