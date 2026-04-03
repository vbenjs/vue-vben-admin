import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

const USER_FIELDS = [
  'userName',
  'nickName',
  'userType',
  'email',
  'phonenumber',
  'sex',
  'avatar',
  'signature',
  'password',
  'status',
  'loginIp',
  'loginDate',
  'remark',
  'deptId',
];

function pickUserFields(data: any): any {
  const result: any = {};
  for (const key of USER_FIELDS) {
    if (data[key] !== undefined) {
      result[key] = data[key];
    }
  }
  return result;
}

function serializeUserEntity(item: any) {
  const serializableItem: any = { ...item };
  ['userId', 'deptId'].forEach((key) => {
    if (typeof serializableItem[key] === 'bigint') {
      serializableItem[key] = serializableItem[key].toString();
    }
  });
  return serializableItem;
}

async function enrichUsers(prisma: PrismaService, users: any[]) {
  if (users.length === 0) {
    return [];
  }

  const serializedUsers = users.map((item) => serializeUserEntity(item));
  const deptIds = Array.from(
    new Set(
      serializedUsers
        .map((item) => item.deptId)
        .filter((deptId) => deptId !== undefined && deptId !== null && `${deptId}` !== ''),
    ),
  ).map((deptId) => Number(deptId));
  const userIds = users.map((item) => item.userId);

  const [depts, userRoles, userPosts]: [any[], any[], any[]] = await Promise.all([
    deptIds.length > 0
      ? prisma.sysDept.findMany({ where: { deptId: { in: deptIds } } as any })
      : Promise.resolve([] as any[]),
    prisma.sysUserRole.findMany({ where: { userId: { in: userIds } } as any }),
    prisma.sysUserPost.findMany({ where: { userId: { in: userIds } } as any }),
  ]);

  const roleIds = Array.from(new Set(userRoles.map((item) => item.roleId)));
  const postIds = Array.from(new Set(userPosts.map((item) => item.postId)));

  const [roles, posts]: [any[], any[]] = await Promise.all([
    roleIds.length > 0
      ? prisma.sysRole.findMany({ where: { roleId: { in: roleIds } } })
      : Promise.resolve([] as any[]),
    postIds.length > 0
      ? prisma.sysPost.findMany({ where: { postId: { in: postIds } } })
      : Promise.resolve([] as any[]),
  ]);

  const deptMap = new Map<string, string | null>();
  depts.forEach((item) => {
    deptMap.set(item.deptId.toString(), item.deptName);
  });
  const roleMap = new Map<number, string>();
  roles.forEach((item) => {
    roleMap.set(item.roleId, item.roleName);
  });
  const postMap = new Map<number, string>();
  posts.forEach((item) => {
    postMap.set(item.postId, item.postName);
  });
  const roleIdsByUser = new Map<string, number[]>();
  const postIdsByUser = new Map<string, number[]>();

  userRoles.forEach((item) => {
    const key = item.userId.toString();
    const ids = roleIdsByUser.get(key) || [];
    ids.push(item.roleId);
    roleIdsByUser.set(key, ids);
  });

  userPosts.forEach((item) => {
    const key = item.userId.toString();
    const ids = postIdsByUser.get(key) || [];
    ids.push(item.postId);
    postIdsByUser.set(key, ids);
  });

  return serializedUsers.map((item) => {
    const userId = `${item.userId}`;
    const currentRoleIds = roleIdsByUser.get(userId) || [];
    const currentPostIds = postIdsByUser.get(userId) || [];
    return {
      ...item,
      deptName: item.deptId ? deptMap.get(`${item.deptId}`) || '' : '',
      roleIds: currentRoleIds,
      roleNames: currentRoleIds.map((roleId) => roleMap.get(roleId)).filter(Boolean),
      postIds: currentPostIds,
      postNames: currentPostIds.map((postId) => postMap.get(postId)).filter(Boolean),
    };
  });
}

@Injectable()
export class SysUserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any, username: string) {
    const preparedData = {
      password: '123456',
      ...pickUserFields(data),
      createBy: username,
    };
    if (preparedData.deptId) preparedData.deptId = BigInt(preparedData.deptId);

    const res = await this.prisma.sysUser.create({
      data: preparedData,
    });

    if (data.roleIds && Array.isArray(data.roleIds) && data.roleIds.length > 0) {
      await this.prisma.sysUserRole.createMany({
        data: data.roleIds.map((roleId: number) => ({ userId: res.userId, roleId })),
      });
    }
    if (data.postIds && Array.isArray(data.postIds) && data.postIds.length > 0) {
      await this.prisma.sysUserPost.createMany({
        data: data.postIds.map((postId: number) => ({ userId: res.userId, postId })),
      });
    }

    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }

  async findAll(params: {
    deptId?: number;
    phonenumber?: string;
    skip?: number;
    status?: string;
    take?: number;
    userName?: string;
  }) {
    const { skip, take, userName, phonenumber, status, deptId } = params;
    const where = {
      ...(userName ? { userName: { contains: userName } } : {}),
      ...(phonenumber ? { phonenumber: { contains: phonenumber } } : {}),
      ...(status ? { status } : {}),
      ...(deptId ? { deptId: BigInt(deptId) } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.sysUser.findMany({
        skip,
        take,
        where,
        orderBy: { createTime: 'desc' },
      }),
      this.prisma.sysUser.count({ where }),
    ]);

    const enrichedItems = await enrichUsers(this.prisma, items);
    return { items: enrichedItems, total };
  }

  async findOne(id: number) {
    const user = await this.prisma.sysUser.findUnique({ where: { userId: BigInt(id) } });
    if (!user) {
      return null;
    }

    const [enrichedUser] = await enrichUsers(this.prisma, [user]);
    return enrichedUser || null;
  }

  async remove(id: number) {
    const res = await this.prisma.sysUser.delete({ where: { userId: BigInt(id) } });
    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }

  async update(id: number, data: any, username: string) {
    const preparedData = { ...pickUserFields(data), updateBy: username };
    if (preparedData.deptId) preparedData.deptId = BigInt(preparedData.deptId);

    const res = await this.prisma.sysUser.update({
      where: { userId: BigInt(id) },
      data: preparedData,
    });

    if (data.roleIds !== undefined && Array.isArray(data.roleIds)) {
      await this.prisma.sysUserRole.deleteMany({ where: { userId: BigInt(id) } });
      if (data.roleIds.length > 0) {
        await this.prisma.sysUserRole.createMany({
          data: data.roleIds.map((roleId: number) => ({ userId: BigInt(id), roleId })),
        });
      }
    }

    if (data.postIds !== undefined && Array.isArray(data.postIds)) {
      await this.prisma.sysUserPost.deleteMany({ where: { userId: BigInt(id) } });
      if (data.postIds.length > 0) {
        await this.prisma.sysUserPost.createMany({
          data: data.postIds.map((postId: number) => ({ userId: BigInt(id), postId })),
        });
      }
    }

    return { ...res, userId: res.userId.toString(), deptId: res.deptId?.toString() };
  }
}
