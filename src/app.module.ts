import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from './company/company.module';
import databaseConfig from './config/database.config';
import { ValidatorModule } from './common/validators/validator.module';
import { InvoiceModule } from './invoice/invoice.module';
import redisConfig from './config/redis.config';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import mailConfig from './config/mail.config';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import authConfig from './config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, databaseConfig, redisConfig, mailConfig, authConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: configService.get('app.environment') == 'development',
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
        },
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.host'),
          port: +configService.get('mail.port'),
          auth: {
            user: configService.get('mail.auth.username'),
            pass: configService.get('mail.auth.password'),
          },
          ignoreTLS: configService.get('mail.ignoreTLS'),
          secure: configService.get('mail.secure'),
        },
        defaults: {
          from: `"${configService.get('mail.from.name')}" <${configService.get(
            'mail.from.address',
          )}>`,
        },
        template: {
          dir: join(__dirname),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        preview: configService.get<boolean>('mail.preview'),
      }),
    }),
    ValidatorModule,
    CompanyModule,
    InvoiceModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
