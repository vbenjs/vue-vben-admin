import type { Component } from 'vue';

interface AnalysisOverviewItem {
  icon: Component | string;
  title: string;
  totalTitle: string;
  totalValue: number;
  value: number;
}

interface WorkbenchProjectItem {
  color?: string;
  content: string;
  date: string;
  group: string;
  icon: Component | string;
  title: string;
}
interface WorkbenchQuickNavItem {
  color?: string;
  icon: Component | string;
  title: string;
}

export type {
  AnalysisOverviewItem,
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
};
