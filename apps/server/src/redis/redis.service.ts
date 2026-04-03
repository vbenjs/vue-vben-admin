import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  private client?: Redis;
  private readonly logger = new Logger(RedisService.name);
  private readonly memoryCache = new Map<string, string>();

  async del(key: string): Promise<void> {
    this.memoryCache.delete(key);
    if (!this.client) {
      return;
    }
    try {
      await this.client.del(key);
    } catch {
      this.logger.warn(`Redis del failed for key ${key}, fallback to memory cache.`);
    }
  }

  async get<T>(key: string): Promise<null | T> {
    const memoryData = this.memoryCache.get(key);
    if (memoryData) {
      return JSON.parse(memoryData) as T;
    }

    if (!this.client) {
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch {
      this.logger.warn(`Redis get failed for key ${key}, fallback to memory cache.`);
      return null;
    }
  }

  async onModuleDestroy() {
    if (!this.client) {
      return;
    }
    await this.client.quit();
    this.logger.log('Redis Cache connection destroyed.');
  }

  async onModuleInit() {
    try {
      const client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        lazyConnect: true,
        port: Number(process.env.REDIS_PORT) || 6379,
      });
      await client.connect();
      await client.ping();
      this.client = client;
      this.logger.log('Redis Cache connection initialized. (Real ioredis)');
    } catch {
      this.client = undefined;
      this.logger.warn('Redis unavailable, using in-memory cache fallback.');
    }
  }

  async set(key: string, value: any, ttlSecond: number = 3600): Promise<void> {
    this.memoryCache.set(key, JSON.stringify(value));
    if (!this.client) {
      return;
    }
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSecond);
    } catch {
      this.logger.warn(`Redis set failed for key ${key}, fallback to memory cache.`);
    }
  }
}
