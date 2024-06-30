import { Module } from '@nestjs/common';

import { MockService } from './mock.service';

@Module({
  exports: [MockService],
  providers: [MockService],
})
export class MockModule {}
