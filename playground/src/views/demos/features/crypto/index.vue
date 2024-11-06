<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import {
  Card as ACard,
  Col as ACol,
  Divider as ADivider,
  Input as AInput,
  RadioButton as ARadioButton,
  RadioGroup as ARadioGroup,
  Row as ARow,
  Textarea as ATextarea,
} from 'ant-design-vue';

import {
  aesDecryptFn,
  aesEncryptFn,
  desDecryptFn,
  desEncryptFn,
  hashingFn,
} from '#/views/demos/features/crypto/inner/CryptoHooks';

const targetInputTextRef = ref('testtest');
const secretKeyRef = ref('3mbzyxbpg6613ql');
const encryModeRef = ref('aes');

const aseEncryptTextRef = ref('');
const needDecryptTextRef = ref('');

const doAesEncryptFn = () => {
  const text =
    encryModeRef.value === 'aes'
      ? aesEncryptFn(targetInputTextRef.value, secretKeyRef.value)
      : desEncryptFn(targetInputTextRef.value, secretKeyRef.value);
  aseEncryptTextRef.value = text;
  needDecryptTextRef.value = text;
};
const parseTextComputed = computed(() => {
  const value =
    encryModeRef.value === 'aes'
      ? aesDecryptFn(needDecryptTextRef.value, secretKeyRef.value)
      : desDecryptFn(needDecryptTextRef.value, secretKeyRef.value);
  return value;
});
watch(
  [
    () => targetInputTextRef.value,
    () => secretKeyRef.value,
    () => encryModeRef.value,
  ],
  () => {
    doAesEncryptFn();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="box-border w-full px-2">
    <ACard class="mb-3" title="使用Crypto加密">
      <div>要操作的字符串</div>
      <AInput
        v-model:value="targetInputTextRef"
        placeholder="请输入药操作的字符串"
      />
      <div>使用的密钥</div>
      <AInput v-model:value="secretKeyRef" />
    </ACard>
    <ARow>
      <ACol :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <ACard class="mr-1" title="Hashing">
          <div
            class="px-10px box-border flex w-full flex-col divide-y overflow-x-hidden"
          >
            <div
              class="flex h-auto w-full flex-row justify-between overflow-hidden"
            >
              <div class="flex-none">
                <span :style="{ paddingRight: '10px' }">md5:</span>
              </div>
              <div class="h-auto flex-1 overflow-x-hidden">
                <div class="w-full text-wrap break-words text-right">
                  {{ hashingFn(targetInputTextRef, 'MD5') }}
                </div>
              </div>
            </div>
            <div
              class="flex h-auto w-full flex-row justify-between overflow-hidden"
            >
              <div class="flex-none">
                <span :style="{ paddingRight: '10px' }">SHA1:</span>
              </div>
              <div class="h-auto flex-1 overflow-x-hidden">
                <div class="w-full text-wrap break-words text-right">
                  {{ hashingFn(targetInputTextRef, 'SHA1') }}
                </div>
              </div>
            </div>
            <div
              class="flex h-auto w-full flex-row justify-between overflow-hidden"
            >
              <div class="flex-none">
                <span :style="{ paddingRight: '10px' }">SHA256:</span>
              </div>
              <div class="h-auto flex-1 overflow-x-hidden">
                <div class="w-full text-wrap break-words text-right">
                  {{ hashingFn(targetInputTextRef, 'SHA256') }}
                </div>
              </div>
            </div>
            <div
              class="flex h-auto w-full flex-row justify-between overflow-hidden"
            >
              <div class="flex-none">
                <span :style="{ paddingRight: '10px' }">SHA512:</span>
              </div>
              <div class="h-auto flex-1 overflow-x-hidden">
                <div class="w-full text-wrap break-words text-right">
                  {{ hashingFn(targetInputTextRef, 'SHA512') }}
                </div>
              </div>
            </div>
          </div>
        </ACard>
      </ACol>
      <ACol :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <ACard title="Ciphers">
          <div
            class="px-10px box-border flex w-full flex-col overflow-x-hidden"
          >
            <div
              class="box-border flex flex-row items-center justify-between pb-2"
            >
              <div class="flex-none">加密方式：</div>
              <div class="flex-1 text-center">
                <ARadioGroup
                  v-model:value="encryModeRef"
                  button-style="solid"
                  size="small"
                >
                  <ARadioButton value="aes">AES</ARadioButton>
                  <ARadioButton value="des">DES</ARadioButton>
                </ARadioGroup>
              </div>
            </div>
            <ADivider />
            <div v-if="encryModeRef === 'aes'">
              <div
                class="flex h-auto w-full flex-row justify-between overflow-hidden"
              >
                <div class="flex-none">
                  <span :style="{ paddingRight: '10px' }">加密:</span>
                </div>
                <div class="h-auto flex-1 overflow-x-hidden">
                  <div class="w-full text-wrap break-words text-right">
                    {{ aseEncryptTextRef }}
                  </div>
                </div>
              </div>
              <ADivider />
              <div>
                <div>解密:</div>
                <div>要解密的文本</div>
                <ATextarea
                  v-model:value="needDecryptTextRef"
                  placeholder="请输入要操作的字符串"
                />
                <div>解密后的原文</div>
                <ATextarea :value="parseTextComputed" readonly />
              </div>
            </div>
            <div v-else-if="encryModeRef === 'des'">
              <div
                class="flex h-auto w-full flex-row justify-between overflow-hidden"
              >
                <div class="flex-none">
                  <span :style="{ paddingRight: '10px' }">加密:</span>
                </div>
                <div class="h-auto flex-1 overflow-x-hidden">
                  <div class="w-full text-wrap break-words text-right">
                    {{ aseEncryptTextRef }}
                  </div>
                </div>
              </div>
              <ADivider />
              <div>
                <div>解密:</div>
                <div>要解密的文本</div>
                <ATextarea
                  v-model:value="needDecryptTextRef"
                  placeholder="请输入要操作的字符串"
                />
                <div>解密后的原文</div>
                <ATextarea :value="parseTextComputed" readonly />
              </div>
            </div>
          </div>
        </ACard>
      </ACol>
    </ARow>
  </div>
</template>

<style lang="scss" scoped></style>
