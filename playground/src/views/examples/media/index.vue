<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { useTTS } from '@vben/hooks';
import { useXgPlayer } from '@vben/plugins/xg-player';

import { Button, Card, Space } from 'ant-design-vue';

const [XgPlayer, player] = useXgPlayer({
  url: 'https://media.w3.org/2010/05/sintel/trailer.webm',
});

const { cancelSpeech, speakVoice } = useTTS();
</script>

<template>
  <Page title="媒体组件">
    <Card title="视频播放器">
      <div class="h-[350px] w-[500px]">
        <XgPlayer />
      </div>
      <div class="mt-4"></div>
      <Space>
        <Button type="primary" @click="() => player?.play()">播放</Button>
        <Button @click="() => player?.pause()">暂停</Button>
      </Space>
    </Card>
    <div class="mt-4"></div>
    <Card title="语音播报">
      <Space>
        <Button type="primary" @click="speakVoice('吃了吗，今天天气真好')">
          播报
        </Button>
        <Button @click="cancelSpeech">暂停</Button>
      </Space>
    </Card>
  </Page>
</template>

<style scoped></style>
