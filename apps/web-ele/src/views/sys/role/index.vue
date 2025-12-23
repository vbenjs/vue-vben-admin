<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';

import { Delete, Edit, Plus, Refresh, Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import {
  addRoleApi,
  deleteRoleApi,
  getMenuList,
  getRoleInfoApi,
  getRolePage,
  saveRoleMenusApi,
  updateRoleApi,
} from '#/api/core';

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
  remark: '',
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
const assignMenuTreeRef = ref();

const Props = ref({
  label: 'name',
  children: 'children',
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
      ElMessage.error('菜单数据格式错误');
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
    menuDialog.menuIds = checkedKeys;
  }
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
};

// 编辑角色
const handleEdit = async (row: any) => {
  dialog.type = 'edit';
  dialog.title = '编辑角色';

  try {
    const res = await getRoleInfoApi(row.id);
    if (res.code === 200 || res.code === 0) {
      Object.assign(formModel, res.data);
      dialog.visible = true;
    } else {
      ElMessage.error(res.msg || '获取角色详情失败');
    }
  } catch (error: any) {
    console.error('获取角色详情错误:', error);
    // 失败时使用列表中的基本信息
    Object.assign(formModel, { ...row, menuIdList: row.menuIdList || [] });
    dialog.visible = true;
  }
};

// 保存角色
const saveRole = async () => {
  // 1. 基本验证
  if (!formModel.name.trim()) {
    ElMessage.warning('请输入角色名称');
    return;
  }
  if (!formModel.roleCode.trim()) {
    ElMessage.warning('请输入角色编码');
    return;
  }

  // 2. 准备数据（根据添加或编辑）
  let saveData: any;
  let apiCall: Promise<any>;

  if (dialog.type === 'edit' && formModel.id > 0) {
    // 编辑模式
    saveData = {
      id: formModel.id,
      name: formModel.name.trim(),
      roleCode: formModel.roleCode.trim(),
      remark: formModel.remark.trim(),
      menuIdList: [...(formModel.menuIdList || [])],
    };
    apiCall = updateRoleApi(saveData);
  } else {
    // 添加模式
    saveData = {
      name: formModel.name.trim(),
      roleCode: formModel.roleCode.trim(),
      remark: formModel.remark.trim(),
      menuIdList: [...(formModel.menuIdList || [])],
    };
    apiCall = addRoleApi(saveData);
  }

  console.warn('准备发送的数据:', saveData);

  try {
    // 3. 调用API
    const result = await apiCall;
    console.warn('API响应:', result);
    // 4. 处理响应 - 根据后端响应格式调整
    if (result.code === 0 || result.code === 200) {
      ElMessage.success(dialog.type === 'add' ? '添加成功' : '修改成功');
      dialog.visible = false;
      await getRoleList(); // 刷新列表
    } else {
      // 显示错误信息
      ElMessage.error(result.msg || result.message || '操作失败');
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

    // console.log('删除成功');
    // console.log('等待后端更新...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 刷新列表
    // console.log('刷新列表...');
    await getRoleList();

    // console.log('删除流程完成');
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
// const assignUsers = (row: any) => {
//   userDialog.roleId = row.id;
//   userDialog.roleName = row.name;
//   userDialog.visible = true;
// };

// 分配菜单权限-打开分配菜单对话框
// const assignMenus = async (row: any) => {
//   menuDialog.roleId = row.id;
//   menuDialog.roleName = row.name;
//   menuDialog.visible = true;
//   try {
//     const res = await getRoleMenuIdsApi(row.id);
//     menuDialog.menuIds =
//       res.code === 200 || res.code === 0 ? res.data || [] : [];
//   } catch (error) {
//     console.error('获取角色菜单失败:', error);
//     menuDialog.menuIds = [];
//   }

//   menuDialog.visible = true;
// };

// 保存菜单权限
// const saveRoleMenus = async () => {
//   if (!menuDialog.roleId) {
//     return;
//   }

//   try {
//     const res = await saveRoleMenusApi(menuDialog.roleId, menuDialog.menuIds);
//     if (res.code === 200 || res.code === 0) {
//       closeMenuDialog();
//       getRoleList(); // 刷新列表
//     }
//   } catch (error) {
//     console.error('保存角色菜单失败:', error);
//   }
// };

const closeMenuDialog = () => {
  menuDialog.visible = false;
  menuDialog.menuIds = []; // 清空菜单ID
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
            <!-- <el-button
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
            </el-button> -->
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
      <div>
        <p>这里放置角色用户分配界面</p>
        <p>可以显示用户列表，搜索，分页等功能</p>
      </div>
      <template #footer>
        <el-button @click="closeUserDialog()">取消</el-button>
        <el-button type="primary">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="menuDialog.visible"
      :title="`分配权限-${menuDialog.roleName}`"
      width="600px"
    >
      <div>
        <p>这里放置菜单分配界面</p>
        <p>可以显示菜单树形结构，勾选权限</p>
      </div>
      <template #footer>
        <el-button @click="closeMenuDialog">取消</el-button>
        <el-button type="primary">保存</el-button>
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
