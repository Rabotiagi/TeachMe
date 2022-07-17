require('dotenv').config();
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountsModule } from 'src/accounts/accounts.module';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [AccountsModule, PassportModule, JwtModule.register({
    secret: process.env.JWT_KEY,
    signOptions: { expiresIn: '2m' }
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy, Repository],
  exports: [AuthService]
})
export class AuthModule {}
