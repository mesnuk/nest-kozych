import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule
      ],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        parseInt8: true,
        type: 'postgres',
        host: configService.getOrThrow<string>('DATA_BASE_HOST'),
        port: +configService.getOrThrow<number>('DATA_BASE_PORT'),
        username: configService.getOrThrow<string>('DATA_BASE_USER_NAME'),
        password: configService.getOrThrow<string>('DATA_BASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATA_BASE_NAME'),
        entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
        ],
        migrations: [],
        synchronize: true,
        autoLoadEntities: true,
        // logging: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
  ],
})
export class DatabaseModule {}


