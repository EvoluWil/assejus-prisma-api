import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { PartnerModule } from './modules/partner/partner.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthService } from './providers/auth/auth.service';
import { AuthController } from './providers/auth/auth.controller';
import { AuthModule } from './providers/auth/auth.module';
import { EnsureAuthenticated } from './providers/middlewares/ensure.authenticated.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    PartnerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService, AuthService],
})
export class AppModule implements NestModule {
  ensureAuthenticatedExclude = [
    { path: '/partner', method: RequestMethod.GET },
    { path: '/user', method: RequestMethod.POST },
    { path: '/auth/sign-in', method: RequestMethod.POST },
    { path: '/auth/reset-password', method: RequestMethod.POST },
    { path: '/auth/forgot-password', method: RequestMethod.POST },
  ];

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthenticated)
      .exclude(...this.ensureAuthenticatedExclude)
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
