import { Module } from '@nestjs/common';

import { ResearchFundClaimController } from './research-fund-claim.controller';
import { ResearchFundClaimService } from './research-fund-claim.service';

@Module({
  controllers: [ResearchFundClaimController],
  providers: [ResearchFundClaimService],
})
export class ResearchFundClaimModule {}
