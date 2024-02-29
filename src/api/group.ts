import { QueryStoreGroupForm, StoreGroupResult } from './model/groupModel';
import { defHttp } from '@/utils/http/axios';

enum Api {
  pmGroup = '/admin/pmGroup',
  info = '/admin/pmGroup/',
  create = '/admin/pmGroup/create',
  update = '/admin/pmGroup/update',
  delete = '/admin/pmGroup/delete/',

  member = '/admin/pmGroup/member/',
  addMember = '/admin/pmGroup/addMember',
  deleteMember = '/admin/pmGroup/deleteMember/',
}

export function getStoreGroup(data: QueryStoreGroupForm, isTable = false) {
  return defHttp.post<StoreGroupResult[]>(
    {
      url: Api.pmGroup,
      data,
    },
    {
      isTable,
    },
  );
}

export function getStoreGroupById(id: number) {
  return defHttp.post<StoreGroupResult>({
    url: Api.info + id,
  });
}

export function createStoreGroup(data = {}) {
  return defHttp.post({
    url: Api.create,
    data,
  });
}

export function updateStoreGroup(data = {}) {
  return defHttp.post({
    url: Api.update,
    data,
  });
}

export function deleteStoreGroup(id: number) {
  return defHttp.post({
    url: Api.delete + id,
  });
}

export function getStoreGroupMember(id: number) {
  return defHttp.post({
    url: Api.member + id,
  });
}

export function addStoreGroupMember(data: {}) {
  return defHttp.post({
    url: Api.addMember,
    data,
  });
}

export function deleteStoreGroupMember(id: number) {
  return defHttp.post({
    url: Api.deleteMember + id,
  });
}
