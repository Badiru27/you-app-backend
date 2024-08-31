import { Module } from '@nestjs/common';
import { MongoService } from './mongo_db.service';

@Module({
  providers: [MongoService],
  exports: [MongoService],
})
export class DataModule {}
