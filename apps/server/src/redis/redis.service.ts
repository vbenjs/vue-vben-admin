import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    });
    this.logger.log('Redis Cache connection initialized. (Real ioredis)');
  }

  async onModuleDestroy() {
    await this.client.quit();
    this.logger.log('Redis Cache connection destroyed.');
  }

  async set(key: string, value: any, ttlSecond: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSecond);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
