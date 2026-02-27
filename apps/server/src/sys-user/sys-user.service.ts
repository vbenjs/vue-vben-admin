import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysUserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { skip?: number; take?: number; userName?: string; phonenumber?: string; status?: string; deptId?: number }) {
    const { skip, take, userName, phonenumber, status, deptId } = params;
    const where = {
      ...(userName ? { userName: { contains: userName } } : {}),
      ...(phonenumber ? { phonenumber: { contains: phonenumber } } : {}),
      ...(status ? { status } : {}),
      ...(deptId ? { deptId: BigInt(deptId) } : {}),
    };

    const items = await this.prisma.sysUser.findMany({
      skip,
      take,
      where,
      orderBy: { createTime: 'desc' },
    });
    
    // Serialize bigints before returning array
    const serializedItems = items.map(item => {
      const serializableItem: any = { ...item };
      ['userId', 'deptId'].forEach(key => {
        if (typeof serializableItem[key] === 'bigint') {
          serializableItem[key] = serializableItem[key].toString();
        }
      });
      return serializableItem;
    });

    const total = await this.prisma.sysUser.count({ where });

    return { items: serializedItems, total };
  }

  async findOne(id: number) {
    const user = await this.prisma.sysUser.findUnique({ where: { userId: BigInt(id) } });
    if (user) {
      const serializableItem: any = { ...user };
      ['userId', 'deptId'].forEach(key => {
        if (typeof serializableItem[key] === 'bigint') {
          serializableItem[key] = serializableItem[key].toString();
        }
      });
      return serializableItem;
    }
    return null;
  }

  async create(data: any, username: string) {
    const preparedData = { ...data, createBy: username };
    if (preparedData.deptId) preparedData.deptId = BigInt(preparedData.deptId);
    
    const res = await this.prisma.sysUser.create({
      data: preparedData,
    });
    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }

  async update(id: number, data: any, username: string) {
    const { userId, ...updateData } = data;
    const preparedData = { ...updateData, updateBy: username };
    if (preparedData.deptId) preparedData.deptId = BigInt(preparedData.deptId);

    const res = await this.prisma.sysUser.update({
      where: { userId: BigInt(id) },
      data: preparedData,
    });
    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }

  async remove(id: number) {
    const res = await this.prisma.sysUser.delete({ where: { userId: BigInt(id) } });
    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }
}
