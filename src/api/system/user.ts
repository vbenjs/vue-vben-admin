import { BasicPageParams, BasicPaginationResult } from '../model/baseModel';
import { Dept } from './dept';
import { Role } from './role';
import { defHttp } from '/@/utils/http/axios';

export interface User {
  id: number;
  username: string;
  nickname: string;
}

export type UserListResult = BasicPaginationResult<User>;

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  username: string;
  nickname: string;
  avatar: string;
  qq: string;
  email: string;
  phone: any;
  remark: string;
  status: number;
  roles: Role[];
  dept: Dept;
}

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  // roles: number[]
}

export type UpdateUserParams = Partial<CreateUserParams>;

export interface UpdateUserPassword {
  id: number;
  password: string;
}

enum Api {
  Base = '/system/users',
  Password = '/system/users/password',
}

export const getUserList = (params?: BasicPageParams) =>
  defHttp.get<UserListResult>({ url: Api.Base, params });

export const getUserInfo = (id: number) => defHttp.get<User>({ url: `${Api.Base}/${id}` });

export const createUser = (params: CreateUserParams) => defHttp.post({ url: Api.Base, params });

export const updateUser = (id: number, params: UpdateUserParams) =>
  defHttp.put({ url: `${Api.Base}/${id}`, params });

export const deleteUser = (id: number) => defHttp.delete({ url: `${Api.Base}/${id}` });

export const updateUserPassword = (params: UpdateUserPassword) =>
  defHttp.patch({ url: Api.Password, params });
