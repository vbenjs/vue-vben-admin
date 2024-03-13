<script lang="tsx">
  import { reactive, onMounted, defineComponent, toRaw } from 'vue';
  import { Checkbox, Divider, Form } from 'ant-design-vue';
  import { getPermissionTree } from '@/api/system/permission';
  import { Icon } from '@/components/Icon';
  import { TreeData } from './type';
  import { checkParent, formatOptions, getSelectAll, handleHide } from './functional';
  import { cloneDeep } from 'lodash-es';
  import { PermissionTree } from '@/ApiModel/system/permissionModel';

  export default defineComponent({
    name: 'AuthTree',
    setup() {
      const CheckboxGroup = Checkbox.Group;
      const FormItemRest = Form.ItemRest;
      const authTreeData = reactive({
        treeData: [] as TreeData[],
        oldPermisssions: [] as PermissionTree[],
      });
      onMounted(async () => {
        const data = await getPermissionTree();
        authTreeData.treeData = data;
        setPermissionList(authTreeData.oldPermisssions);
      });

      const getPermissions = () => {
        const treeData = cloneDeep(toRaw(authTreeData.treeData));
        const permissions = [] as PermissionTree[];

        const checkAndPush = (array?: TreeData[] | null) => {
          const children =
            array?.filter((obj) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
              const { children, actionList, checkedList, hide, ...other } = obj;
              obj.actionList = actionList?.filter((item) => checkedList?.includes(item.id)) ?? null;
              delete obj.checkedList;
              if (children?.length || obj.actionList?.length) {
                permissions.push({
                  ...other,
                  actionList: obj.actionList,
                  children,
                });
                return true;
              }
              return false;
            }) ?? [];
          return children.length ? children : null;
        };
        const pushPermissions = (array?: TreeData[] | null) => {
          if (!array) return;
          array.forEach((item) => {
            pushPermissions(item.children);
            item.children = checkAndPush(item.children);
          });
        };
        treeData.forEach((item) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
          const { children, actionList, checkedList, hide, ...other } = item;
          pushPermissions(children);
          item.children = checkAndPush(item.children);
          item.children?.length &&
            permissions.push({ ...other, actionList, children: item.children });
        });
        return permissions.filter((item) => item.children?.length || item.actionList?.length);
      };

      const setPermissionList = (permissions: PermissionTree[] = []) => {
        const check = (itemk: Omit<TreeData, 'children'>, obj: PermissionTree) => {
          if (itemk.id === obj.id) {
            const checkedList = itemk.checkedList ?? [];
            obj.actionList?.forEach((action) => {
              !checkedList.includes(action.id) && checkedList?.push(action.id);
            });
            itemk.checkedList = checkedList;
          }
        };
        const selectTree = (array: TreeData[] | undefined | null, obj: PermissionTree) => {
          if (!array) return;
          array.forEach((item) => {
            check(item, obj);
            selectTree(item.children, obj);
          });
        };
        permissions.map((obj) => {
          authTreeData.treeData.forEach((item) => {
            selectTree(item.children, obj);
          });
        });
      };

      const renderAction = (data: TreeData) => {
        return (
          <div>
            <FormItemRest>
              <CheckboxGroup
                options={formatOptions(data)}
                v-model:value={data.checkedList}
                // onChange={() => onChange(data)}
              />
            </FormItemRest>
          </div>
        );
      };
      const renderChildren = (data: TreeData) => {
        return data?.children?.map((item, index) => {
          const { checkAll, indeterminate } = getSelectAll(item);
          return (
            <div>
              {!!index && <Divider class="!my-2" />}
              <div class="bg-gray-100 flex">
                <div class="bg-primary w-3px" />
                <div class="p-1">
                  <FormItemRest>
                    <Checkbox
                      indeterminate={indeterminate.value}
                      checked={checkAll.value}
                      onChange={(e) => checkParent(item, e.target.checked)}
                    >
                      {item.permissionName}
                    </Checkbox>
                  </FormItemRest>
                </div>
              </div>
              <div class="p-2">
                {item.actionList && (
                  <div class={item.children ? 'pt-2 pb-4' : ''}>{renderAction(item)}</div>
                )}
                {item.children && renderChildren(item)}
              </div>
            </div>
          );
        });
      };

      return {
        authTreeData,
        renderChildren,
        getPermissions,
        setPermissions: (permissions: PermissionTree[]) => {
          authTreeData.oldPermisssions = permissions;
        },
      };
    },
    render() {
      return (
        <div>
          {this.authTreeData.treeData.map((item) => {
            return (
              <div>
                <div
                  class="text-lg bg-gray-200 p-2 border border-gray-300 cursor-default"
                  onClick={() => handleHide(item.id, this.authTreeData.treeData)}
                >
                  <Icon
                    icon={!item.hide ? 'ant-design:up-outlined' : 'ant-design:down-outlined'}
                    size={18}
                    class="mr-2"
                  />
                  {item.permissionName}
                </div>
                <div v-show={!item.hide} class="border border-gray-200 p-2">
                  {this.renderChildren(item)}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
  });
</script>
