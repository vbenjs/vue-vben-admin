<script setup lang="ts">
import type { CameraEmits, CameraInstance, CameraProps } from './types';

import { onMounted, onUnmounted, ref } from 'vue';

import { Button, Card } from '@vben-core/shadcn-ui';

const props = withDefaults(defineProps<CameraProps>(), {
  width: 640,
  height: 480,
  facingMode: 'user',
  disabled: false,
});

const emit = defineEmits<CameraEmits>();

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isVideoReady = ref(false);
const isLoading = ref(false);
const errorMessage = ref<null | string>(null);
const mediaStream = ref<MediaStream | null>(null);

// 监听视频加载完成
function handleVideoLoad() {
  isVideoReady.value = true;
  errorMessage.value = null;
}

// 开始摄像头
async function startCamera() {
  try {
    isLoading.value = true;
    errorMessage.value = null;

    // 直接使用 navigator.mediaDevices 请求摄像头权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: props.facingMode,
        width: { ideal: props.width },
        height: { ideal: props.height },
      },
    });

    // 保存媒体流的引用
    mediaStream.value = stream;

    // 确保视频元素存在
    if (!videoRef.value) {
      throw new Error('视频元素未初始化');
    }

    // 设置视频源
    videoRef.value.srcObject = stream;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('启动摄像头失败');
    errorMessage.value = err.message;
    emit('error', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
}

// 拍照功能
async function takePhoto(): Promise<string> {
  if (!videoRef.value || !canvasRef.value || !isVideoReady.value) {
    const err = new Error('视频或Canvas未准备就绪');
    errorMessage.value = err.message;
    emit('error', err);
    throw err;
  }

  try {
    isLoading.value = true;
    const context = canvasRef.value.getContext('2d');
    if (!context) {
      throw new Error('无法获取Canvas上下文');
    }

    // 设置canvas尺寸与视频一致
    const { videoWidth, videoHeight } = videoRef.value;
    canvasRef.value.width = videoWidth;
    canvasRef.value.height = videoHeight;

    // 在canvas上绘制当前视频帧（需要考虑镜像效果）
    context.save();
    context.scale(-1, 1); // 水平翻转
    context.drawImage(videoRef.value, -videoWidth, 0, videoWidth, videoHeight);
    context.restore();

    // 将canvas内容转换为图片URL
    const photo = canvasRef.value.toDataURL('image/png');
    emit('update:modelValue', photo);
    emit('success', photo);
    return photo;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('拍照过程出错');
    errorMessage.value = err.message;
    emit('error', err);
    throw err;
  } finally {
    isLoading.value = false;
  }
}

// 重拍功能
async function retake() {
  try {
    isLoading.value = true;
    emit('update:modelValue', null);
    errorMessage.value = null;
    isVideoReady.value = false;

    // 重新启动摄像头
    await startCamera();
  } catch (error) {
    const err = error instanceof Error ? error : new Error('重拍失败');
    errorMessage.value = err.message;
    emit('error', err);
  } finally {
    isLoading.value = false;
  }
}

// 停止摄像头
function stopCamera() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach((track) => track.stop());
    mediaStream.value = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  isVideoReady.value = false;
}

// 组件挂载后自动启动摄像头
onMounted(async () => {
  try {
    await startCamera();
  } catch (error) {
    console.error('初始化摄像头失败:', error);
  }
});

// 组件卸载时停止视频流
onUnmounted(() => {
  stopCamera();
});

// 暴露方法给父组件
defineExpose<CameraInstance>({
  takePhoto,
  retake,
  startCamera,
  stopCamera,
});
</script>

<template>
  <Card class="overflow-hidden">
    <div class="relative aspect-video w-full overflow-hidden bg-slate-100">
      <!-- 错误提示 -->
      <div
        v-if="errorMessage"
        class="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500"
      >
        {{ errorMessage }}
      </div>

      <!-- 加载中 -->
      <div
        v-else-if="isLoading"
        class="absolute inset-0 flex items-center justify-center bg-white/80"
      >
        <div class="text-primary">加载中...</div>
      </div>

      <!-- 视频预览 -->
      <video
        v-show="!modelValue"
        ref="videoRef"
        autoplay
        playsinline
        @loadeddata="handleVideoLoad"
        class="h-full w-full object-cover"
      ></video>

      <!-- 拍摄的照片 -->
      <img
        v-if="modelValue"
        :src="modelValue"
        alt="拍摄的照片"
        class="h-full w-full object-cover"
      />

      <!-- 隐藏的canvas用于拍照 -->
      <canvas ref="canvasRef" class="hidden"></canvas>
    </div>

    <!-- 操作按钮 -->
    <div class="flex items-center justify-between p-4">
      <div class="text-muted-foreground text-sm">
        {{ isVideoReady ? '摄像头已就绪' : '正在准备摄像头...' }}
      </div>

      <div class="flex gap-2">
        <Button
          v-if="!modelValue"
          :disabled="!isVideoReady || disabled"
          @click="takePhoto"
        >
          拍照
        </Button>

        <Button
          v-else
          variant="destructive"
          :disabled="disabled"
          @click="retake"
        >
          重拍
        </Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
video {
  transform: scaleX(-1); /* 镜像显示 */
}
</style>
