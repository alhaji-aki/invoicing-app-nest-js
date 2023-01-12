import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PasswordController } from './controllers/password.controller';
import { PasswordService } from './services/password.service';
import { PasswordReset } from './entities/password-reset.entity';
import { BullModule } from '@nestjs/bull';
import { PasswordResetConsumer } from './consumers/password-reset.consumer';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.secret'),
        signOptions: { expiresIn: configService.get('auth.expiresIn') },
      }),
    }),
    BullModule.registerQueue({
      name: 'auth',
    }),
  ],
  providers: [
    AuthService,
    PasswordService,
    ProfileService,
    LocalStrategy,
    JwtStrategy,
    PasswordResetConsumer,
  ],
  controllers: [AuthController, PasswordController, ProfileController],
  exports: [AuthService],
})
export class AuthModule {}
