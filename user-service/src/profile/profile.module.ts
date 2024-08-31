import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRepo } from './profile.repository';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  providers: [ProfileService, ProfileRepo],
  exports: [ProfileService],
})
export class ProfileModule {}
