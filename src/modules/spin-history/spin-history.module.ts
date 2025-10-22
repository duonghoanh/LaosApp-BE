import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpinHistory, SpinHistorySchema } from './entities/spin-history.entity';
import { SpinHistoryService } from './services/spin-history.service';
import { SpinHistoryResolver } from './resolvers/spin-history.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpinHistory.name, schema: SpinHistorySchema },
    ]),
  ],
  providers: [SpinHistoryService, SpinHistoryResolver],
  exports: [SpinHistoryService],
})
export class SpinHistoryModule {}
