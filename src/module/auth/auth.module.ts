import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy],
  exports: [],
})
export class AuthModule {}
