import type { INestApplication } from '@nestjs/common';

import { NestFactory } from '@nestjs/core';

import plugins from '#/plugins';

import { AppModule } from './index.module';

let app: INestApplication;

async function createApp() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  for (const plugin of plugins) {
    app.use(plugin);
  }

  return app;
}

export async function useApp() {
  if (!app) {
    app = await createApp();
  }

  return app;
}

export async function bootstrap() {
  const app = await useApp();

  await app.listen(import.meta.env.VITE_PORT);
}
