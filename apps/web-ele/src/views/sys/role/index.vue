<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';

import {
  Delete,
  Edit,
  Key,
  Plus,
  Refresh,
  Search,
  User,
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  addRoleApi,
  deleteRoleApi,
  getMenuList,
  getRoleInfoApi,
  getRoleMenuIdsApi,
  getRolePage,
  getRoleUserIdsApi,
  saveRoleMenusApi,
  saveRoleUsersApi,
  updateRoleApi,
} from '#/api/core';
import { getUserPageApi } from '#/api/core/user';
// let mockRoleData = [
//   {
//     id: 1,
//     name: '超级管理员',
//     roleCode: 'admin',
//     createTime: '2025-10-01 10:30:00',
//     remark: '拥有系统所有权限',
//     menuIdList: [1, 2, 3, 4, 5],
//   },
//   {
//     id: 2,
//     name: '普通用户',
//     roleCode: 'user',
//     remark: '只能查看和编辑内容，不能删除',
//     menuIdList: [1, 2, 3],
//     createTime: '2025-10-11 10:30:00',
//   },
//   {
//     id: 3,
//     name: '编辑者',
//     roleCode: 'editor',
//     remark: '查看 编辑 增加 删除',
//     menuIdList: [1, 2, 3, 4],
//     createTime: '2025-10-25 10:30:00',
//   },
// ];

// 角色列表数据
const roleList = ref([]);
const total = ref(0);
const loading = ref(false);

// 请求参数-分页
const params = reactive({
  page: 1,
  limit: 10,
  name: '',
  roleCode: '',
  order: '',
  asc: true,
});

// 表单数据
const formModel = reactive({
  id: 0,
  name: '',
  roleCode: '',
  remark: '' as string,
  menuIdList: [] as number[],
});

// 对话框控制
const dialog = reactive({
  visible: false,
  title: '添加角色',
  type: 'add' as 'add' | 'edit',
});

//  菜单权限数据
const menuTreeData = ref<any[]>([]);
const assignMenuTreeRef = ref(); // 用于编辑角色对话框
const assignMenuTreeRef2 = ref(); // 用于分配权限对话框
const userTableRef = ref(); // 用于分配用户对话框

const Props = ref({
  label: 'name',
  children: 'children',
  isLeaf: (data: any) => {
    return data.type === 1 || !data.children || data.children.length === 0;
  },
});

// 获取菜单树数据
const fetchMenuTree = async () => {
  try {
    // 直接获取数据数组
    const menuData = await getMenuList();
    // console.log('菜单数据:', menuData);

    if (Array.isArray(menuData)) {
      menuTreeData.value = menuData;
      // console.log('菜单数据加载成功，共', menuData.length, '条');
    } else {
      console.warn('菜单数据不是数组:', menuData);
      menuTreeData.value = [];
    }
  } catch (error: any) {
    console.error('获取菜单树失败:', error);

    // 错误信息处理
    let errorMessage = '获取菜单列表失败';
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    }

    ElMessage.error(errorMessage);
    menuTreeData.value = [];
  }
};

// 异步加载节点方法
const loadNode = (node: any, resolve: any) => {
  if (node.level === 0) {
    return resolve(menuTreeData.value || []);
  }
  if (node.data.children && node.data.children.length > 0) {
    return resolve(node.data.children);
  }

  return resolve([]);
};

// 分配菜单选中处理
const handleAssignMenuCheck = () => {
  if (assignMenuTreeRef.value) {
    const checkedKeys = assignMenuTreeRef.value.getCheckedKeys();
    formModel.menuIdList = checkedKeys;
    console.warn('菜单选中更新:', checkedKeys);
  }
};

// 处理树节点勾选事件
const handleTreeCheck = (checkedNode: any, checkedInfo: any) => {
  console.warn('树节点勾选事件:', {
    选中节点: checkedNode,
    选中信息: checkedInfo,
    选中的keys: checkedInfo.checkedKeys,
    半选的keys: checkedInfo.halfCheckedKeys,
  });
  // 实时更新到 formModel
  formModel.menuIdList = [
    ...checkedInfo.checkedKeys,
    ...checkedInfo.halfCheckedKeys,
  ];
};

// 获取角色列表
const getRoleList = async () => {
  loading.value = true;
  const res = await getRolePage(params);
  roleList.value = res.list || [];
  total.value = res.total;
  loading.value = false;
};

// 添加角色-打开对话框
const handleAdd = () => {
  dialog.type = 'add';
  dialog.title = '添加角色';
  dialog.visible = true;

  // 重置表单数据
  Object.assign(formModel, {
    id: 0,
    name: '',
    roleCode: '',
    remark: '',
    menuIdList: [],
  });
  nextTick(() => {
    if (assignMenuTreeRef.value) {
      // 清空树组件的所有选中项
      assignMenuTreeRef.value.setCheckedKeys([]);
      console.warn('已清空树组件选中状态');
    }
  });
};

// 编辑角色 - 修正类型错误
const handleEdit = async (row: any) => {
  console.warn('编辑角色，ID:', row.id);
  dialog.type = 'edit';
  dialog.title = '编辑角色';
  dialog.visible = true;
  // 重置表单
  Object.assign(formModel, {
    id: row.id || 0,
    name: row.name || '',
    roleCode: row.roleCode || '',
    remark: row.remark || '',
    menuIdList: row.menuIdList || [],
  });
  try {
    // getRoleInfoApi 返回 Result<SysRoleVO>
    const result = await getRoleInfoApi(row.id);
    console.warn('API完整响应:', result);
    if (!result) {
      console.warn('API返回空值');
      return;
    }
    // 检查响应状态码
    if (result.code !== 0) {
      console.warn('API返回错误:', result.msg);
      return;
    }
    // 提取 data 字段
    const roleData = result.data;
    console.warn('角色详情数据:', roleData);
    if (roleData) {
      // 更新表单
      formModel.name = roleData.name || '';
      formModel.roleCode = roleData.roleCode || '';
      formModel.remark = roleData.remark || '';
      formModel.menuIdList = Array.isArray(roleData.menuIdList)
        ? roleData.menuIdList
        : [];
      console.warn('更新后的表单数据:', formModel);
      // 设置树组件选中状态
      nextTick(() => {
        if (assignMenuTreeRef.value) {
          // 先清空选择
          assignMenuTreeRef.value.setCheckedKeys([]);
          // 如果有菜单权限，设置选中
          if (formModel.menuIdList.length > 0) {
            assignMenuTreeRef.value.setCheckedKeys(formModel.menuIdList);
            console.warn('已设置树组件选中:', formModel.menuIdList);
          } else {
            console.warn('菜单权限为空');
          }
        } else {
          console.warn('树组件未初始化');
        }
      });
    }
  } catch (error: any) {
    console.error('获取详情错误:', error);
  }
};

// 保存角色
const saveRole = async () => {
  // 基本验证
  if (!formModel.name.trim()) {
    ElMessage.warning('请输入角色名称');
    return;
  }
  if (!formModel.roleCode.trim()) {
    ElMessage.warning('请输入角色编码');
    return;
  }

  // 在保存前从树组件获取选中的菜单
  let finalMenuIds: number[] = [];
  if (assignMenuTreeRef.value) {
    try {
      // 获取所有选中的节点
      const checkedKeys = assignMenuTreeRef.value.getCheckedKeys();
      const halfCheckedKeys = assignMenuTreeRef.value.getHalfCheckedKeys();
      console.warn('获取到的菜单权限:', {
        checkedKeys,
        halfCheckedKeys,
        总数: checkedKeys.length + halfCheckedKeys.length,
      });
      // 合并选中项
      finalMenuIds = [...checkedKeys, ...halfCheckedKeys];
      // 更新 formModel
      formModel.menuIdList = finalMenuIds;
    } catch (error) {
      console.error('获取菜单选中状态失败:', error);
      finalMenuIds = formModel.menuIdList || [];
    }
  } else {
    console.warn('树组件未找到，使用 formModel.menuIdList');
    finalMenuIds = formModel.menuIdList || [];
  }

  // 3. 准备数据
  let saveData: any;
  let apiCall: Promise<any>;

  if (dialog.type === 'edit' && formModel.id > 0) {
    // 编辑模式
    saveData = {
      id: formModel.id,
      name: formModel.name.trim(),
      roleCode: formModel.roleCode.trim(),
      remark: formModel.remark.trim(),
      menuIdList: finalMenuIds, // 使用获取到的菜单ID
    };
    apiCall = updateRoleApi(saveData);
  } else {
    // 添加模式
    saveData = {
      name: formModel.name.trim(),
      roleCode: formModel.roleCode.trim(),
      remark: formModel.remark.trim(),
      menuIdList: finalMenuIds, // 使用获取到的菜单ID
    };
    apiCall = addRoleApi(saveData);
  }

  console.warn('准备发送的数据:', saveData);

  try {
    // 4. 调用API
    const result = await apiCall;
    // console.warn('API响应:', result);
    // 5. 处理响应
    if (!result || result.code === 0 || result.code === 200) {
      ElMessage.success(dialog.type === 'add' ? '添加成功' : '修改成功');
      dialog.visible = false;
      await getRoleList(); // 刷新列表
    } else {
      // 显示错误信息
    }
  } catch (error: any) {
    console.error('保存失败:', error);
  }
};

// 删除角色-调用后端接口
const handleDelete = async (row: any) => {
  try {
    // console.log('开始删除角色:', row.name);

    await ElMessageBox.confirm(`确定删除角色 "${row.name}" 吗？`, '提示', {
      type: 'warning',
    });

    // 发送删除请求
    await deleteRoleApi([row.id]);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    await getRoleList();
  } catch (error: any) {
    console.error('删除错误:', error);
    if (error !== 'cancel' && error.message !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 组件挂载后自动加载角色列表
onMounted(() => {
  getRoleList();
  fetchMenuTree(); // 初始化加载菜单树
});

// 分配用户对话框
const userDialog = reactive({
  visible: false,
  roleId: 0,
  roleName: '',
});

// 用户列表数据
const userList = ref([]);
const userTotal = ref(0);
const userLoading = ref(false);

// 用户搜索参数
const userParams = reactive({
  page: 1,
  limit: 10,
  username: '',
});

// 已选中的用户ID列表
const selectedUserIds = ref<number[]>([]);

// 分配菜单对话框
const menuDialog = reactive({
  visible: false,
  roleId: 0,
  roleName: '',
  menuIds: [] as number[],
});

// 关闭对话框函数
const closeUserDialog = () => {
  userDialog.visible = false;
  userDialog.roleId = 0;
  userDialog.roleName = '';
  selectedUserIds.value = [];
  userList.value = [];
  userTotal.value = 0;
  // 清空表格选中状态
  nextTick(() => {
    if (userTableRef.value) {
      userTableRef.value.clearSelection();
    }
  });
};

// 搜索
const handleSearch = () => {
  params.page = 1;
  getRoleList();
};

// 重置
const handleReset = () => {
  params.name = '';
  params.roleCode = '';
  params.page = 1;
  getRoleList();
};

// 分页处理
const handleSizeChange = (size: number) => {
  params.limit = size;
  params.page = 1;
  getRoleList();
};

const handleCurrentChange = (page: number) => {
  params.page = page;
  getRoleList();
};

// 分配用户-打开分配用户对话框
const assignUsers = async (row: any) => {
  userDialog.roleId = row.id;
  userDialog.roleName = row.name;
  userDialog.visible = true;

  // 重置搜索参数
  userParams.page = 1;
  userParams.username = '';

  // 清空之前的选中状态
  nextTick(() => {
    if (userTableRef.value) {
      userTableRef.value.clearSelection();
    }
  });

  // 获取用户列表
  await getUserList();

  // 获取角色已有用户
  try {
    const res = await getRoleUserIdsApi(row.id);
    const userIds = res.code === 200 || res.code === 0 ? res.data || [] : [];
    selectedUserIds.value = userIds;

    // 设置表格选中状态
    nextTick(() => {
      if (userTableRef.value && userIds.length > 0) {
        userList.value.forEach((user: any) => {
          if (userIds.includes(user.id)) {
            userTableRef.value.toggleRowSelection(user, true);
          }
        });
      }
    });
  } catch (error) {
    console.error('获取角色用户失败:', error);
    selectedUserIds.value = [];
  }
};

// 获取用户列表
const getUserList = async () => {
  userLoading.value = true;
  try {
    const res = await getUserPageApi(userParams);
    // userList.value = res.list || [];
    userTotal.value = res.total || 0;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    userList.value = [];
    userTotal.value = 0;
  } finally {
    userLoading.value = false;
  }
};

// 用户搜索
const handleUserSearch = () => {
  userParams.page = 1;
  getUserList();
};

// 用户重置
const handleUserReset = () => {
  userParams.username = '';
  userParams.page = 1;
  getUserList();
};

// 用户分页
const handleUserSizeChange = (size: number) => {
  userParams.limit = size;
  userParams.page = 1;
  getUserList();
};

const handleUserCurrentChange = (page: number) => {
  userParams.page = page;
  getUserList();
};

// 处理表格选择变化
const handleUserSelectionChange = (selection: any[]) => {
  selectedUserIds.value = selection.map((item) => item.id);
};

// 保存角色用户分配
const saveRoleUsers = async () => {
  if (!userDialog.roleId) {
    ElMessage.warning('请选择角色');
    return;
  }

  try {
    const res = await saveRoleUsersApi(
      userDialog.roleId,
      selectedUserIds.value,
    );
    if (res.code === 200 || res.code === 0) {
      ElMessage.success('用户分配成功');
      closeUserDialog();
      getRoleList(); // 刷新角色列表
    } else {
      ElMessage.error(res.msg || '用户分配失败');
    }
  } catch (error: any) {
    console.error('保存角色用户失败:', error);
    ElMessage.error(error.message || '用户分配失败');
  }
};

// 分配菜单权限-打开分配菜单对话框
const assignMenus = async (row: any) => {
  menuDialog.roleId = row.id;
  menuDialog.roleName = row.name;
  try {
    const res = await getRoleMenuIdsApi(row.id);
    menuDialog.menuIds =
      res.code === 200 || res.code === 0 ? res.data || [] : [];
    // 设置树组件选中状态
    nextTick(() => {
      if (assignMenuTreeRef2.value) {
        assignMenuTreeRef2.value.setCheckedKeys([]);
        if (menuDialog.menuIds.length > 0) {
          assignMenuTreeRef2.value.setCheckedKeys(menuDialog.menuIds);
          console.warn('已设置分配权限树组件选中:', menuDialog.menuIds);
        }
      }
    });
  } catch (error) {
    console.error('获取角色菜单失败:', error);
    menuDialog.menuIds = [];
  }
  menuDialog.visible = true;
};

// 保存菜单权限
const saveRoleMenus = async () => {
  if (!menuDialog.roleId) {
    ElMessage.warning('请选择角色');
    return;
  }

  // 从树组件获取选中的菜单
  let finalMenuIds: number[] = [];
  if (assignMenuTreeRef2.value) {
    try {
      // 获取所有选中的节点
      const checkedKeys = assignMenuTreeRef2.value.getCheckedKeys();
      const halfCheckedKeys = assignMenuTreeRef2.value.getHalfCheckedKeys();
      console.warn('获取到的菜单权限:', {
        checkedKeys,
        halfCheckedKeys,
        总数: checkedKeys.length + halfCheckedKeys.length,
      });
      // 合并选中项
      finalMenuIds = [...checkedKeys, ...halfCheckedKeys];
    } catch (error) {
      console.error('获取菜单选中状态失败:', error);
      finalMenuIds = menuDialog.menuIds || [];
    }
  } else {
    console.warn('分配权限树组件未找到');
    finalMenuIds = menuDialog.menuIds || [];
  }

  if (finalMenuIds.length === 0) {
    ElMessage.warning('请至少选择一个菜单权限');
    return;
  }

  try {
    const res = await saveRoleMenusApi(menuDialog.roleId, finalMenuIds);
    if (res.code === 200 || res.code === 0) {
      ElMessage.success('权限分配成功');
      closeMenuDialog();
      getRoleList(); // 刷新列表
    } else {
      ElMessage.error(res.msg || '权限分配失败');
    }
  } catch (error: any) {
    console.error('保存角色菜单失败:', error);
    ElMessage.error(error.message || '权限分配失败');
  }
};

const closeMenuDialog = () => {
  menuDialog.visible = false;
  menuDialog.roleId = 0;
  menuDialog.roleName = '';
  menuDialog.menuIds = [];
  // 清空树组件选中状态
  nextTick(() => {
    if (assignMenuTreeRef2.value) {
      assignMenuTreeRef2.value.setCheckedKeys([]);
    }
  });
};

const closeDialog = () => {
  // 这个是关闭角色对话框的
  dialog.visible = false;
};
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">角色管理</h1>
        <div class="page-desc">管理系统角色和权限分配</div>
      </div>
      <div class="header-extra">
        <el-button type="primary" :icon="Plus" @click="handleAdd">
          添加角色
        </el-button>
      </div>
    </div>
    <!-- 搜索区域 -->
    <el-card class="search-card">
      <el-form :model="params" inline>
        <el-form-item label="角色名称：">
          <el-input
            v-model="params.name"
            placeholder="请输入角色名称"
            style="width: 200px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="角色编码：">
          <el-input
            v-model="params.roleCode"
            placeholder="请输入角色编码"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格区域 -->
    <el-card>
      <el-table :data="roleList" v-loading="loading" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="角色名称" prop="name" width="120" />
        <el-table-column label="权限字符" prop="roleCode" width="120" />
        <el-table-column label="备注" prop="remark" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              link
              :icon="User"
              @click="assignUsers(row)"
            >
              分配用户
            </el-button>
            <el-button
              type="primary"
              link
              :icon="Key"
              @click="assignMenus(row)"
            >
              分配权限
            </el-button>
            <el-button
              type="danger"
              link
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="params.page"
          v-model:page-size="params.limit"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="total,sizes,prev,pager,next,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
      <el-form :model="formModel" label-width="80px">
        <el-form-item label="角色名称" required>
          <el-input v-model="formModel.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" required>
          <el-input v-model="formModel.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <!-- 菜单权限 -->
        <el-form-item label="菜单权限">
          <el-tree
            ref="assignMenuTreeRef"
            :data="menuTreeData"
            :props="Props"
            :load="loadNode"
            lazy
            node-key="id"
            show-checkbox
            :check-strictly="false"
            @check="handleTreeCheck"
            @check-change="handleAssignMenuCheck"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formModel.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="userDialog.visible"
      :title="`分配用户-${userDialog.roleName}`"
      width="800px"
    >
      <!-- 搜索区域 -->
      <el-form :model="userParams" inline style="margin-bottom: 16px">
        <el-form-item label="用户名：">
          <el-input
            v-model="userParams.username"
            placeholder="请输入用户名"
            style="width: 200px"
            @keyup.enter="handleUserSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleUserSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleUserReset"> 重置 </el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表表格 -->
      <el-table
        ref="userTableRef"
        :data="userList"
        v-loading="userLoading"
        stripe
        @selection-change="handleUserSelectionChange"
        :row-key="(row: any) => row.id"
      >
        <el-table-column
          type="selection"
          width="55"
          :reserve-selection="true"
        />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="用户名" prop="username" width="150" />
        <el-table-column label="头像" prop="avatar" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :icon="User" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180" />
        <el-table-column label="角色" prop="roleName" show-overflow-tooltip />
      </el-table>

      <!-- 分页区域 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="userParams.page"
          v-model:page-size="userParams.limit"
          :total="userTotal"
          :page-sizes="[10, 20, 50, 100]"
          :background="true"
          layout="total,sizes,prev,pager,next,jumper"
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
        />
      </div>

      <template #footer>
        <el-button @click="closeUserDialog()">取消</el-button>
        <el-button type="primary" @click="saveRoleUsers">保存</el-button>
      </template>
    </el-dialog>
    <el-dialog
      v-model="menuDialog.visible"
      :title="`分配权限-${menuDialog.roleName}`"
      width="600px"
    >
      <el-tree
        ref="assignMenuTreeRef2"
        :data="menuTreeData"
        :props="Props"
        :load="loadNode"
        lazy
        node-key="id"
        show-checkbox
        :check-strictly="false"
        style="max-height: 400px; overflow: auto"
      />
      <template #footer>
        <el-button @click="closeMenuDialog">取消</el-button>
        <el-button type="primary" @click="saveRoleMenus">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  padding: 16px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.page-desc {
  font-size: 14px;
  color: #666;
}

.search-card {
  margin-bottom: 16px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
