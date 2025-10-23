<script setup lang="ts">
import { ref } from 'vue';

type MenuSection = {
  title: string;
  items: string[];
};

const sections = ref<{
  group: string;
  description?: string;
  sections: MenuSection[];
}[]>([
  {
    group: '工作台',
    sections: [
      {
        title: '今日概览',
        items: ['智能摘要与下一步建议'],
      },
      {
        title: '任务与活动',
        items: ['待办/我发起/我参与', '最近活动与通知', '全局搜索/命令面板'],
      },
    ],
  },
  {
    group: '项目管理',
    sections: [
      { title: '对话（项目）', items: ['自然语言创建/查询/调整进度与成本'] },
      { title: '项目列表', items: [] },
      { title: '甘特图', items: [] },
      { title: '看板', items: [] },
      { title: '成本分析', items: [] },
      { title: '周交付', items: [] },
      { title: '报表与仪表盘', items: [] },
      { title: '模板中心', items: [] },
    ],
  },
  {
    group: '财务管理',
    sections: [
      { title: '对话（财务）', items: ['自然语言报表/指标解读/告警溯因'] },
      { title: '报表', items: ['日/周/月'] },
      { title: '指标预警', items: [] },
      { title: '历史采购对比', items: [] },
      { title: '财务仪表盘', items: [] },
    ],
  },
  {
    group: '审批管理',
    sections: [
      { title: '对话（审批）', items: ['发起/催办/回撤/解释规则'] },
      { title: '发起申请', items: ['请假/出差/报销/用章'] },
      { title: '待我处理', items: [] },
      { title: '我发起的', items: [] },
      { title: '审批历史', items: [] },
      { title: '流程配置与规则', items: [] },
    ],
  },
  {
    group: '员工管理',
    sections: [
      { title: '对话（人事）', items: ['查档/变更/周月报/绩效问答'] },
      { title: '组织架构', items: [] },
      { title: '员工档案', items: [] },
      { title: '效率评估', items: [] },
      { title: '报告生成', items: ['周报/月报'] },
      { title: '技能矩阵', items: [] },
    ],
  },
  {
    group: '资料库',
    sections: [
      { title: '对话（资料）', items: ['语义检索/对比/引用/版本建议'] },
      { title: '方案资料库', items: [] },
      { title: '设计零件资料库', items: [] },
      { title: 'PLC 设计资料库', items: [] },
      { title: '智能检索', items: [] },
      { title: '上传与版本', items: [] },
    ],
  },
  {
    group: '目标与 BI',
    sections: [
      { title: '对话（目标）', items: ['目标拆解/校验/跟踪/复盘'] },
      { title: '目标管理', items: [] },
      { title: '目标审核', items: [] },
      { title: '业务数据挖掘', items: [] },
      { title: '宣传材料生成', items: [] },
      { title: '业务智能仪表盘', items: [] },
    ],
  },
  {
    group: '数据与集成',
    sections: [
      { title: '对话（数据）', items: ['同步状态问答/排障/调度建议'] },
      { title: '钉钉集成', items: [] },
      { title: '数据库连接器', items: [] },
      { title: '同步调度', items: [] },
      { title: '统一数据访问层', items: [] },
      { title: '数据质量', items: [] },
    ],
  },
  {
    group: '设置与安全',
    sections: [
      { title: '对话（设置）', items: ['权限解释/最小授权/异常排查'] },
      { title: '公司切换', items: [] },
      { title: '权限与角色', items: [] },
      { title: '数据源配置', items: [] },
      { title: '安全与认证', items: [] },
      { title: '审计日志', items: [] },
    ],
  },
  {
    group: '帮助与支持',
    sections: [
      { title: '对话（帮助）', items: ['问文档/提工单/诊断报告'] },
      { title: '使用指南', items: [] },
      { title: '反馈与工单', items: [] },
      { title: '版本与更新', items: [] },
      { title: '关于', items: [] },
    ],
  },
  {
    group: '个人中心',
    sections: [
      { title: '我的资料', items: [] },
      { title: '偏好设置', items: ['默认“智能模式”'] },
      { title: '我的收藏', items: [] },
      { title: '最近访问', items: [] },
    ],
  },
]);
</script>

<template>
  <div class="p-6 space-y-8">
    <div>
      <h1 class="text-2xl font-semibold">导航总览</h1>
      <p class="text-gray-500 mt-1">基于顶层信息架构的菜单草图</p>
    </div>
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <section
        v-for="g in sections"
        :key="g.group"
        class="rounded-lg border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-sm"
      >
        <header class="px-4 py-3 border-b border-gray-100 dark:border-neutral-800">
          <h2 class="text-lg font-medium">{{ g.group }}</h2>
          <p v-if="g.description" class="text-xs text-gray-500 mt-0.5">
            {{ g.description }}
          </p>
        </header>
        <div class="p-4 space-y-4">
          <div
            v-for="s in g.sections"
            :key="s.title"
            class="rounded-md bg-gray-50 dark:bg-neutral-800 p-3"
          >
            <div class="text-sm font-medium mb-2">{{ s.title }}</div>
            <ul class="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
              <li v-for="(i, idx) in (s.items.length ? s.items : ['（占位）'])" :key="idx">
                {{ i }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
  
</template>

<style scoped>
</style>

