import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SysRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const roleSort = data.roleSort === undefined ? 0 : Number(data.roleSort);
    return this.prisma.sysRole.create({
      data: {
        ...data,
        roleSort,
        createBy: username,
      },
    });
  }

  async findAll(params: {
    roleKey?: string;
    roleName?: string;
    skip?: number;
    status?: string;
    take?: number;
  }) {
    const { skip, take, roleKey, roleName, status } = params;
    const where = {
      ...(roleName ? { roleName: { contains: roleName } } : {}),
      ...(roleKey ? { roleKey: { contains: roleKey } } : {}),
      ...(status ? { status } : {}),
    };

    const items = await this.prisma.sysRole.findMany({
      skip,
      take,
      where,
      orderBy: { roleSort: 'asc' },
    });
    const total = await this.prisma.sysRole.count({ where });

    return { items, total };
  }

  async findOne(id: number) {
    return this.prisma.sysRole.findUnique({ where: { roleId: id } });
  }

  async remove(id: number) {
    return this.prisma.sysRole.delete({ where: { roleId: id } });
  }

  async update(id: number, data: any, username: string) {
    const roleSort = data.roleSort === undefined ? 0 : Number(data.roleSort);
    const { roleId, key, children, parent, title, value, ...updateData } = data;
    return this.prisma.sysRole.update({
      where: { roleId: id },
      data: {
        ...updateData,
        roleSort,
        updateBy: username,
      },
    });
  }

  /** 获取角色绑定的菜单ID列表 */
  async getRoleMenuIds(roleId: number): Promise<number[]> {
    const records = await this.prisma.sysRoleMenu.findMany({
      where: { roleId },
      select: { menuId: true },
    });
    return records.map((r) => r.menuId);
  }

  /** 保存角色的菜单权限 (全量替换) */
  async saveRoleMenus(roleId: number, menuIds: number[]) {
    // 先删除旧的关联
    await this.prisma.sysRoleMenu.deleteMany({ where: { roleId } });
    // 再批量插入新的关联
    if (menuIds.length > 0) {
      await this.prisma.sysRoleMenu.createMany({
        data: menuIds.map((menuId) => ({ roleId, menuId })),
      });
    }
    return { success: true };
  }
}
