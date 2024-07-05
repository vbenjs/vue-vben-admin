import type { MockDatabaseData } from './mock.interface';

import fs from 'node:fs';
import path from 'node:path';

import { Injectable, type OnModuleInit } from '@nestjs/common';
import bcrypt from 'bcryptjs';

@Injectable()
export class MockService implements OnModuleInit {
  private data: MockDatabaseData;
  private readonly filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '.', 'mock-db.json');
    this.loadData();
  }

  private loadData() {
    const fileData = fs.readFileSync(this.filePath, 'utf8');
    this.data = JSON.parse(fileData);
  }

  private saveData() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  addItem(collection: string, item: any) {
    this.data[collection].push(item);
    this.saveData();
    return item;
  }

  clearCollection(collection: string) {
    this.data[collection] = [];
    this.saveData();
    return this.data[collection];
  }

  findAll(collection: string) {
    return this.data[collection];
  }

  findOneById(collection: string, id: number) {
    return this.data[collection].find((item) => item.id === id);
  }

  async onModuleInit() {
    // 清空表，并初始化两条数据
    await this.clearCollection('users');

    // 密码哈希
    const hashPassword = await bcrypt.hash('123456', 10);

    await this.addItem('users', {
      id: 0,
      password: hashPassword,
      realName: 'Vben',
      roles: ['super'],
      username: 'vben',
    });

    await this.addItem('users', {
      id: 1,
      password: hashPassword,
      realName: 'Admin',
      roles: ['admin'],
      username: 'admin',
    });
    await this.addItem('users', {
      id: 2,
      password: hashPassword,
      realName: 'Jack',
      roles: ['user'],
      username: 'jack',
    });
    const count = await this.findAll('users').length;
    console.log('Database has been initialized with seed data, count:', count);
  }
}
