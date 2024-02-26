<template>
  <a-modal
    v-model:visible="modalVisible"
    :title="$t('system.views.user.account.title')"
    :ok-button-props="{ disabled: !computedHasEditPermission, loading: saveLoading }"
    :ok-text="$t('common.button.save')"
    width="1200px"
    :mask-closable="false"
    @ok="handleSave"
  >
    <a-spin :spinning="dataLoading">
      <a-descriptions :title="$t('system.views.user.account.title')" bordered>
        <a-descriptions-item :label="$t('system.views.user.table.username')">
          {{ userData.username }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.table.fullName')">
          {{ userData.fullName }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.table.userType')">
          {{ userData.userType }}
        </a-descriptions-item>

        <a-descriptions-item :label="$t('system.views.user.table.mobile')">
          {{ userData.mobile }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.table.email')" :span="2">
          {{ userData.email }}
        </a-descriptions-item>

        <a-descriptions-item :label="$t('system.views.user.account.createTime')">
          {{ formatTime(accountData.createTime) }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.account.accountStatus')">
          {{ accountData.accountStatus }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.account.initialPasswordYn')">
          <ATag v-if="accountData.initialPasswordYn" color="#f50">
            {{ $t('common.form.yes') }}
          </ATag>
          <ATag v-else color="#108ee9">{{ $t('common.form.no') }}</ATag>
        </a-descriptions-item>

        <a-descriptions-item :label="$t('system.views.user.account.loginFailTime')">
          {{ accountData.loginFailTime }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.account.lockTime')">
          {{ formatTime(accountData.lockTime) }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('system.views.user.account.passwordModifyTime')">
          {{ formatTime(accountData.passwordModifyTime) }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider />
      <section class="account-setting">
        <div class="title">{{ $t('system.views.user.account.accountSet') }}</div>
        <a-form :model="accountData">
          <a-row :gutter="18">
            <a-col :span="12">
              <a-form-item
                name="maxConnections"
                :label="$t('system.views.user.account.maxConnections')"
              >
                <a-input-number
                  v-model:value="accountData.maxConnections"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                name="maxDaysSinceLogin"
                :label="$t('system.views.user.account.maxDaysSinceLogin')"
              >
                <a-input-number
                  v-model:value="accountData.maxDaysSinceLogin"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="18">
            <a-col :span="12">
              <a-form-item
                name="passwordLifeDays"
                :label="$t('system.views.user.account.passwordLifeDays')"
              >
                <a-input-number
                  v-model:value="accountData.passwordLifeDays"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                name="maxConnectionsPolicy"
                :label="$t('system.views.user.account.maxConnectionsPolicy')"
              >
                <a-select
                  v-model:value="accountData.maxConnectionsPolicy"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                >
                  <a-select-option value="LOGIN_NOT_ALLOW">
                    {{ $t('system.views.user.account.loginNotAllow') }}
                  </a-select-option>
                  <a-select-option value="FIRST_USER_LOGOUT">
                    {{ $t('system.views.user.account.firstUserLogout') }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="18">
            <a-col :span="12">
              <a-form-item
                name="loginFailTimeLimit"
                :label="$t('system.views.user.account.loginFailTimeLimit')"
              >
                <a-input-number
                  v-model:value="accountData.loginFailTimeLimit"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                name="passwordErrorUnlockSecond"
                :label="$t('system.views.user.account.passwordErrorUnlockSecond')"
              >
                <a-input-number
                  v-model:value="accountData.passwordErrorUnlockSecond"
                  :disabled="!computedHasEditPermission"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item name="ipWhiteList" :label="$t('system.views.user.account.ipWhiteList')">
            <a-textarea
              v-model:value="accountData.ipWhiteList"
              :disabled="!computedHasEditPermission"
              :placeholder="$t('system.views.user.account.ipWhiteListPlaceholder')"
              :rows="4"
            />
          </a-form-item>
        </a-form>
      </section>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  import dayjs from 'dayjs';

  import { useShowAccount } from './UserAccountUpdateHooks';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { hasPermission } from '@/utils/auth';

  /**
   * 用户账户更新弹窗
   */
  export default defineComponent({
    name: 'UserAccountUpdateModal',
    setup() {
      const { t } = useI18n();
      const { modalVisible, dataLoading, userData, accountData, show, handleSave, saveLoading } =
        useShowAccount(t);

      /**
       * 格式化时间
       */
      const formatTime = (timeValue: any) => {
        if (timeValue) {
          return dayjs(timeValue).format('YYYY-MM-DD HH:mm:ss');
        }
        return '';
      };

      /**
       * 是否有编辑权限
       */
      const computedHasEditPermission = computed(() => hasPermission('sys:account:update'));

      return {
        modalVisible,
        dataLoading,
        userData,
        accountData,
        show,
        formatTime,
        ...useSizeSetting(),
        computedHasEditPermission,
        handleSave,
        saveLoading,
      };
    },
  });
</script>

<style lang="less" scoped>
  .account-setting {
    .title {
      margin-bottom: 5px;
      font-size: 16px;
      font-weight: 700;
    }
  }
</style>
