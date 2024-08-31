import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from './profile.repository';

@Module({
  providers: [ProfileService, Profile],
})
export class ProfileModule {}
