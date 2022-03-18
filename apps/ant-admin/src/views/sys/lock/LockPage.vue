<template>
  <div
    :class="prefixCls"
    class="fixed inset-0 flex items-center justify-center w-screen h-screen bg-black"
  >
    <div
      :class="`${prefixCls}__unlock`"
      class="absolute top-0 flex flex-col items-center justify-center h-16 pt-5 text-white transform translate-x-1/2 cursor-pointer left-1/2 sm:text-md xl:text-xl"
      @click="handleShowForm(false)"
      v-show="showDate"
    >
      <LockOutlined />
      <span>{{ t('sys.lock.unlock') }}</span>
    </div>

    <div class="flex items-center justify-center w-screen h-screen">
      <div
        :class="`${prefixCls}__hour`"
        class="relative w-2/5 mr-5 md:mr-20 h-2/5 md:h-4/5"
      >
        <span>{{ hour }}</span>
        <span
          class="absolute meridiem left-5 top-5 text-md xl:text-xl"
          v-show="showDate"
        >
          {{ meridiem }}
        </span>
      </div>
      <div :class="`${prefixCls}__minute w-2/5 h-2/5 md:h-4/5 `">
        <span> {{ minute }}</span>
      </div>
    </div>
    <transition name="fade-slide">
      <div :class="`${prefixCls}-entry`" v-show="!showDate">
        <div :class="`${prefixCls}-entry-content`">
          <div :class="`${prefixCls}-entry__header enter-x`">
            <img
              :src="userinfo.avatar || headerImg"
              :class="`${prefixCls}-entry__header-img`"
            />
            <p :class="`${prefixCls}-entry__header-name`">
              {{ userinfo.realName }}
            </p>
          </div>
          <InputPassword
            :placeholder="t('sys.lock.placeholder')"
            class="enter-x"
            v-model:value="password"
          />
          <span :class="`${prefixCls}-entry__err-msg enter-x`" v-if="errMsg">
            {{ t('sys.lock.alert') }}
          </span>
          <div :class="`${prefixCls}-entry__footer enter-x`">
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2 enter-x"
              :disabled="loading"
              @click="handleShowForm(true)"
            >
              {{ t('common.back') }}
            </a-button>
            <a-button
              type="link"
              size="small"
              class="mt-2 mr-2 enter-x"
              :disabled="loading"
              @click="goLogin"
            >
              {{ t('sys.lock.backToLogin') }}
            </a-button>
            <a-button
              class="mt-2"
              type="link"
              size="small"
              @click="unLock()"
              :loading="loading"
            >
              {{ t('sys.lock.entry') }}
            </a-button>
          </div>
        </div>
      </div>
    </transition>

    <div
      class="absolute w-full text-center text-gray-300 bottom-5 xl:text-xl 2xl:text-3xl enter-y"
    >
      <div class="mb-4 text-5xl enter-x" v-show="!showDate">
        {{ hour }}:{{ minute }} <span class="text-3xl">{{ meridiem }}</span>
      </div>
      <div class="text-2xl">{{ year }}/{{ month }}/{{ day }} {{ week }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Input } from 'ant-design-vue'
import { useUserStore } from '@/store/user'
import { useLockStore } from '@/store/lock'
import { useI18n } from '@pkg/locale'
import { useNow } from './useNow'
import { useDesign } from '@/hooks/web/useDesign'
import { LockOutlined } from '@ant-design/icons-vue'
import headerImg from '@/assets/images/header.jpg'

const InputPassword = Input.Password

const password = ref('')
const loading = ref(false)
const errMsg = ref(false)
const showDate = ref(true)

const { prefixCls } = useDesign('lock-page')
const lockStore = useLockStore()
const userStore = useUserStore()

const { hour, month, minute, meridiem, year, day, week } = useNow(true)

const { t } = useI18n()

const userinfo = computed(() => {
  return userStore.getUserInfo || {}
})

/**
 * @description: unLock
 */
async function unLock() {
  if (!password.value) {
    return
  }
  let pwd = password.value
  try {
    loading.value = true
    const res = await lockStore.unLock(pwd)
    errMsg.value = !res
  } finally {
    loading.value = false
  }
}

function goLogin() {
  userStore.logout(true)
  lockStore.resetLockInfo()
}

function handleShowForm(show = false) {
  showDate.value = show
}
</script>
<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-lock-page';

.@{prefix-cls} {
  z-index: @lock-page-z-index;

  &__unlock {
    transform: translate(-50%, 0);
  }

  &__hour,
  &__minute {
    display: flex;
    font-weight: 700;
    color: #bababa;
    background-color: #141313;
    border-radius: 30px;
    justify-content: center;
    align-items: center;

    @media screen and (max-width: @screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (min-width: @screen-md) {
      span:not(.meridiem) {
        font-size: 160px;
      }
    }

    @media screen and (max-width: @screen-sm) {
      span:not(.meridiem) {
        font-size: 90px;
      }
    }
    @media screen and (min-width: @screen-lg) {
      span:not(.meridiem) {
        font-size: 220px;
      }
    }

    @media screen and (min-width: @screen-xl) {
      span:not(.meridiem) {
        font-size: 260px;
      }
    }
    @media screen and (min-width: @screen-2xl) {
      span:not(.meridiem) {
        font-size: 320px;
      }
    }
  }

  &-entry {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgb(0 0 0 / 50%);
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
        margin: 0 auto;
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
