<script setup lang="ts">
// @ts-nocheck
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Col, Row, Statistic } from 'ant-design-vue';

// 简单模拟的系统运行状态，真实业务中应从后端读取（os模块的内存/CPU等指标）
const systemInfo = ref({
  cpuUsage: 35,
  memUsage: 60,
  osVersion: 'Windows 11',
  nodeVersion: 'v20.x',
  uptime: '15天 6小时',
});
</script>

<template>
  <Page>
    <div class="p-4">
      <Row :gutter="16">
        <Col :span="8">
          <Card title="CPU使用率" bordered>
            <Statistic :value="systemInfo.cpuUsage" suffix="%" />
          </Card>
        </Col>
        <Col :span="8">
          <Card title="内存使用率" bordered>
            <Statistic :value="systemInfo.memUsage" suffix="%" />
          </Card>
        </Col>
        <Col :span="8">
          <Card title="运行时长" bordered>
            <Statistic :value="systemInfo.uptime" />
          </Card>
        </Col>
      </Row>
      <Row :gutter="16" class="mt-4">
        <Col :span="24">
          <Card title="系统信息" bordered>
            <Row>
              <Col :span="12">
                <p><strong>操作系统:</strong> {{ systemInfo.osVersion }}</p>
              </Col>
              <Col :span="12">
                <p><strong>Node 版本:</strong> {{ systemInfo.nodeVersion }}</p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>
