import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepo } from './auth.repository';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [JwtModule.register({}), DataModule],
  providers: [AuthService, AuthRepo, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
