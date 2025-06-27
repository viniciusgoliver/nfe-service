import { type ConfigService } from '@nestjs/config';

export const redisConfig = async (
  configService: ConfigService,
): Promise<any> => ({
  redis: {
    host: configService.get<string>('redis.host'),
    port: configService.get<number>('redis.port'),
  },
});
