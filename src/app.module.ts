import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { graphqlConfig } from './config/graphql.config';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { WheelModule } from './modules/wheel/wheel.module';
import { ChatModule } from './modules/chat/chat.module';
import { SpinHistoryModule } from './modules/spin-history/spin-history.module';
import { AuthMiddleware } from './common/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    GraphQLModule.forRoot(graphqlConfig),
    UserModule,
    RoomModule,
    WheelModule,
    ChatModule,
    SpinHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
