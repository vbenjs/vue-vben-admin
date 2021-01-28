<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__unlock`" @click="handleShowForm(false)" v-show="showDate">
      <LockOutlined />
      <span>{{ t('sys.lock.unlock') }}</span>
    </div>

    <div :class="`${prefixCls}__date`">
      <div :class="`${prefixCls}__hour`">
        {{ hour }}
        <span class="meridiem" v-show="showDate">{{ meridiem }}</span>
      </div>
      <div :class="`${prefixCls}__minute`">
        {{ minute }}
      </div>
    </div>
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div :class="`${prefixCls}-entry__header`">
            <img :src="headerImg" :class="`${prefixCls}-entry__header-img`" />
            <p :class="`${prefixCls}-entry__header-name`">
              {{ realName }}
            </p>
          </div>
          <InputPassword :placeholder="t('sys.lock.placeholder')" v-model:value="password" />
          <span :class="`${prefixCls}-entry__err-msg`" v-if="errMsgRef">
            {{ t('sys.lock.alert') }}
          </span>
          <div :class="`${prefixCls}-entry__footer`">
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2"
              :disabled="loadingRef"
              @click="handleShowForm(true)"
            >
              {{ t('common.back') }}
            </a-button>
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2"
              :disabled="loadingRef"
              @click="goLogin"
            >
              {{ t('sys.lock.backToLogin') }}
            </a-button>
            <a-button class="mt-2" type="link" size="small" @click="unLock()" :loading="loadingRef">
              {{ t('sys.lock.entry') }}
            </a-button>
          </div>
        </div>
      </div>
    </transition>

    <div :class="`${prefixCls}__footer-date`">
      <div class="time" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="meridiem">{{ meridiem }}</span>
      </div>
      <div class="date"> {{ year }}/{{ month }}/{{ day }} {{ week }} </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { Input } from 'ant-design-vue';

  import { userStore } from '/@/store/modules/user';
  import { lockStore } from '/@/store/modules/lock';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { useNow } from './useNow';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { LockOutlined } from '@ant-design/icons-vue';
  import headerImg from '/@/assets/images/header.jpg';

  export default defineComponent({
    name: 'LockPage',
    components: { LockOutlined, InputPassword: Input.Password },

    setup() {
      const passwordRef = ref('');
      const loadingRef = ref(false);
      const errMsgRef = ref(false);
      const showDate = ref(true);

      const { prefixCls } = useDesign('lock-page');

      const { ...state } = useNow(true);

      const { t } = useI18n();

      const realName = computed(() => {
        const { realName } = userStore.getUserInfoState || {};
        return realName;
      });

      /**
       * @description: unLock
       */
      async function unLock() {
        if (!passwordRef.value) {
          return;
        }
        let password = passwordRef.value;
        try {
          loadingRef.value = true;
          const res = await lockStore.unLockAction({ password });
          errMsgRef.value = !res;
        } finally {
          loadingRef.value = false;
        }
      }

      function goLogin() {
        userStore.loginOut(true);
        lockStore.resetLockInfo();
      }

      function handleShowForm(show = false) {
        showDate.value = show;
      }

      return {
        goLogin,
        realName,
        unLock,
        errMsgRef,
        loadingRef,
        t,
        prefixCls,
        showDate,
        password: passwordRef,
        handleShowForm,
        headerImg,
        ...state,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-lock-page';

  .@{prefix-cls} {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: @lock-page-z-index;
    display: flex;
    width: 100vw;
    height: 100vh;
    // background: rgba(23, 27, 41);
    background: #000;
    align-items: center;
    justify-content: center;

    &__unlock {
      position: absolute;
      top: 0;
      left: 50%;
      display: flex;
      height: 50px;
      padding-top: 20px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      transform: translate(-50%, 0);
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s;
    }

    &__date {
      display: flex;
      width: 100vw;
      height: 100vh;
      align-items: center;
      justify-content: center;
    }

    &__hour {
      position: relative;
      margin-right: 80px;

      .meridiem {
        position: absolute;
        top: 20px;
        left: 20px;
        font-size: 26px;
      }
      @media (max-width: @screen-xs) {
        margin-right: 20px;
      }
    }

    &__hour,
    &__minute {
      display: flex;
      width: 40%;
      height: 74%;
      // font-size: 50em;
      font-weight: 700;
      color: #bababa;
      background: #141313;
      border-radius: 30px;
      justify-content: center;
      align-items: center;
      // .respond-to(large-only, { font-size: 25em;});
      // .respond-to(large-only, { font-size: 30em;});
      @media (min-width: @screen-xxxl-min) {
        font-size: 46em;
      }
      @media (min-width: @screen-xl-max) and (max-width: @screen-xxl-max) {
        font-size: 38em;
      }

      @media (min-width: @screen-lg-max) and (max-width: @screen-xl-max) {
        font-size: 30em;
      }
      @media (min-width: @screen-md-max) and (max-width: @screen-lg-max) {
        font-size: 23em;
      }
      @media (min-width: @screen-sm-max) and (max-width: @screen-md-max) {
        height: 50%;
        font-size: 12em;
        border-radius: 10px;

        .meridiem {
          font-size: 20px;
        }
      }
      @media (min-width: @screen-xs-max) and (max-width: @screen-sm-max) {
        font-size: 13em;
      }
      @media (max-width: @screen-xs) {
        height: 30%;
        font-size: 5em;
        border-radius: 10px;

        .meridiem {
          font-size: 14px;
        }
      }
    }

    &__footer-date {
      position: absolute;
      bottom: 20px;
      width: 100%;
      font-family: helvetica;
      color: #bababa;
      text-align: center;

      .time {
        font-size: 50px;

        .meridiem {
          font-size: 32px;
        }
      }

      .date {
        font-size: 26px;
      }
    }

    &-entry {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      justify-content: center;
      align-items: center;

      &-content {
        width: 260px;
      }

      &__header {
        text-align: center;

        &-img {
          width: 70px;
          border-radius: 50%;
        }

        &-name {
          margin-top: 5px;
          font-weight: 500;
          color: #bababa;
        }
      }

      &__err-msg {
        display: inline-block;
        margin-top: 10px;
        color: @error-color;
      }

      &__footer {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
