<script lang="ts" setup>
import type {
  VxeGridDefines,
  VxeGridInstance,
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeToolbarPropTypes,
} from 'vxe-table';

import type { SetupContext } from 'vue';

import type { VbenFormProps } from '@vben-core/form-ui';

import type { ExtendedVxeGridApi, VxeGridProps } from './types';

import {
  computed,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  onUnmounted,
  toRaw,
  useSlots,
  useTemplateRef,
  watch,
} from 'vue';

import { usePriorityValues } from '@vben/hooks';
import { EmptyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import {
  cloneDeep,
  cn,
  isBoolean,
  isEqual,
  mergeWithArrayOverride,
} from '@vben/utils';

import { VbenHelpTooltip, VbenLoading } from '@vben-core/shadcn-ui';

import { VxeUI } from '@vxe-ui/core';
import { VxeButton } from 'vxe-pc-ui';
import { VxeGrid } from 'vxe-table';

import { extendProxyOptions, wrapProxyAjaxOptions } from './extends';
import {
  GRID_SECTION_GAP_VAR,
  GRID_SEPARATOR_BLEED_LEFT_VAR,
  GRID_SEPARATOR_BLEED_RIGHT_VAR,
  isBodySectioned,
  resolveGridSectionVars,
  resolveSegmentedMode,
  resolveSeparatorFullBleed,
  resolveSeparatorStripClass,
  resolveSeparatorStyle,
  resolveSeparatorVisible,
  resolveSurfaceClass,
  resolveSurfaceStyle,
  validateSectionLayouts,
} from './grid-sections';
import { useTableForm } from './init';
import { applyViewedRowOptions, useViewedRow } from './viewed-row';

import 'vxe-table/styles/cssvar.scss';
import 'vxe-pc-ui/styles/cssvar.scss';
import './style.css';

interface Props extends VxeGridProps {
  api: ExtendedVxeGridApi;
}

const props = withDefaults(defineProps<Props>(), {});

const FORM_SLOT_PREFIX = 'form-';

const TOOLBAR_ACTIONS = 'toolbar-actions';
const TOOLBAR_TOOLS = 'toolbar-tools';
const TABLE_TITLE = 'table-title';

const gridRef = useTemplateRef<VxeGridInstance>('gridRef');

const state = props.api?.useStore?.();

const {
  gridOptions,
  class: className,
  gridClass,
  gridEvents,
  formOptions,
  tableTitle,
  tableData,
  tableTitleHelp,
  showSearchForm,
  separator,
  segmented,
  sectionOptions,
  formClass,
  viewedRowOptions,
} = usePriorityValues(props, state);

// viewedRowOptions：helper 只创建一次（persist/keyField 不支持运行时切换）
// actionCodes、rowClassName、rowStyle、viewedKeys 的变化通过 options computed 自然响应
const gridApi = props.api;

watch(
  viewedRowOptions,
  (cfg) => {
    // helper 已存在则不重建
    if (gridApi.viewedRowHelper) return;

    if (!cfg) return;

    const keyField = (gridOptions.value?.rowConfig as any)?.keyField || 'id';
    const resolved = isBoolean(cfg) ? { keyField } : { keyField, ...cfg };
    gridApi.viewedRowHelper = useViewedRow(resolved);
  },
  { immediate: true },
);

const { isMobile } = usePreferences();

const slots: SetupContext['slots'] = useSlots();

const [Form, formApi] = useTableForm({
  compact: true,
  handleSubmit: async () => {
    const formValues = await formApi.getValues();
    formApi.setLatestSubmissionValues(toRaw(formValues));
    props.api.reload(formValues);
  },
  handleReset: async () => {
    const prevValues = await formApi.getValues();
    await formApi.reset();
    const formValues = await formApi.getValues();
    formApi.setLatestSubmissionValues(formValues);
    // 如果值发生了变化，submitOnChange会触发刷新。所以只在submitOnChange为false或者值没有发生变化时，手动刷新
    if (isEqual(prevValues, formValues) || !formOptions.value?.submitOnChange) {
      props.api.reload(formValues);
    }
  },
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  showCollapseButton: true,
  submitButtonOptions: {
    content: computed(() => $t('common.search')),
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

// ===== 分段(segmented)布局 =====
// 壳层 -> [表单表面 + 分隔区];下段经 data-vben-grid-sectioned 走 style.css

const segmentedMode = computed(() => resolveSegmentedMode(segmented.value));

const isSeparator = computed(() => {
  if (!formOptions.value || showSearchForm.value === false) {
    return false;
  }
  return resolveSeparatorVisible(separator.value, segmentedMode.value);
});

const separatorFullBleed = computed(() =>
  resolveSeparatorFullBleed(separator.value, segmentedMode.value),
);

const separatorStripClass = computed(() =>
  resolveSeparatorStripClass(separator.value, segmentedMode.value),
);

const separatorStyle = computed(() =>
  resolveSeparatorStyle(separator.value, separatorFullBleed.value),
);

// 分隔区:默认形态承载分隔条间距;card 形态承载两卡间距(分隔条隐藏时仍有 gap)
const isSeparatorZoneVisible = computed(() => {
  return isSeparator.value || segmentedMode.value === 'card';
});

const separatorZoneStyle = computed(() => {
  if (segmentedMode.value !== 'card') {
    return undefined;
  }
  if (isSeparator.value) {
    return {
      paddingBlock: `calc(var(${GRID_SECTION_GAP_VAR}, 0.5rem) / 2)`,
    };
  }
  return { height: `var(${GRID_SECTION_GAP_VAR}, 0.5rem)` };
});

const surfaceClass = computed(() =>
  resolveSurfaceClass(segmentedMode.value, formClass.value),
);

const surfaceStyle = computed(() => resolveSurfaceStyle(sectionOptions.value));

const isGridSectioned = computed(() =>
  isBodySectioned(segmentedMode.value, sectionOptions.value),
);

const gridSectionVars = computed(() =>
  resolveGridSectionVars(segmentedMode.value, sectionOptions.value),
);

// 无工具栏时,分隔条/独立面板与表头之间仍需留白;透明且无分隔条的
// 表单已经通过 surface 的底部 padding 提供间距,不再重复追加。
const needsBodyTopInset = computed(
  () =>
    segmentedMode.value === 'card' ||
    (!!formOptions.value &&
      showSearchForm.value !== false &&
      (isSeparator.value || segmentedMode.value === 'zone')),
);

const showTableTitle = computed(() => {
  return !!slots[TABLE_TITLE] || tableTitle.value;
});

const showToolbar = computed(() => {
  return (
    !!slots[TOOLBAR_ACTIONS] || !!slots[TOOLBAR_TOOLS] || showTableTitle.value
  );
});

const toolbarOptions = computed(() => {
  const hasSlotActions = !!slots[TOOLBAR_ACTIONS];
  const hasSlotTools = !!slots[TOOLBAR_TOOLS];
  const searchBtn: VxeToolbarPropTypes.ToolConfig = {
    code: 'search',
    icon: 'vxe-icon-search',
    circle: true,
    status: showSearchForm.value ? 'primary' : undefined,
    title: showSearchForm.value
      ? $t('common.hideSearchPanel')
      : $t('common.showSearchPanel'),
  };
  // 将搜索按钮合并到用户配置的toolbarConfig.tools中
  const toolbarConfig: VxeGridPropTypes.ToolbarConfig = {
    tools: (gridOptions.value?.toolbarConfig?.tools ??
      []) as VxeToolbarPropTypes.ToolConfig[],
  };
  if (gridOptions.value?.toolbarConfig?.search && !!formOptions.value) {
    toolbarConfig.tools = Array.isArray(toolbarConfig.tools)
      ? [...toolbarConfig.tools, searchBtn]
      : [searchBtn];
  }

  if (!showToolbar.value) {
    toolbarConfig.enabled = false;
    return { toolbarConfig };
  }

  // 强制使用固定的toolbar配置，不允许用户自定义
  // 减少配置的复杂度，以及后续维护的成本
  toolbarConfig.slots = {
    ...(hasSlotActions || showTableTitle.value
      ? { buttons: TOOLBAR_ACTIONS }
      : {}),
    ...(hasSlotTools ? { tools: TOOLBAR_TOOLS } : {}),
  };
  return { toolbarConfig };
});

const options = computed(() => {
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};

  // mergeWithArrayOverride is defu-based: nested objects that only exist in
  // the defaults layers keep their original references, so the merged result
  // must be cloned before it is mutated below. Otherwise writes such as
  // `proxyConfig.autoLoad/enabled` would pollute the caller's source options.
  const rawMergedOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    toRaw(toolbarOptions.value),
    toRaw(gridOptions.value),
    globalGridConfig,
  );
  const mergedOptions: VxeTableGridProps = cloneDeep(rawMergedOptions);

  // Keep the columns/data references stable when unrelated reactive options
  // change. Otherwise VXE reloads the columns and loses its initialized sort
  // state, and a cloned data array would make VXE overwrite the data set via
  // instance methods (reloadData, setMergeCells, ...) with stale option data.
  mergedOptions.columns = rawMergedOptions.columns;
  mergedOptions.data = rawMergedOptions.data;

  if (mergedOptions.proxyConfig) {
    const { ajax } = mergedOptions.proxyConfig;
    mergedOptions.proxyConfig.enabled = !!ajax;
    // 不自动加载数据, 由组件控制
    mergedOptions.proxyConfig.autoLoad = false;
    // gridOptions 可能由父组件以 prop 传入（优先级高于 state），写入
    // state 的包装器会被 prop 遮蔽。这里对最终传给 VxeGrid 的克隆选项
    // 就地包装（幂等），父组件的 prop 不会被修改。
    wrapProxyAjaxOptions(gridApi, mergedOptions, () =>
      formApi.getLatestSubmissionValues(),
    );
  }

  if (mergedOptions.pagerConfig) {
    const mobileLayouts = [
      'PrevJump',
      'PrevPage',
      'Number',
      'NextPage',
      'NextJump',
    ] as any;
    const layouts = [
      'Total',
      'Sizes',
      'Home',
      ...mobileLayouts,
      'End',
    ] as readonly string[];
    mergedOptions.pagerConfig = mergeWithArrayOverride(
      {},
      mergedOptions.pagerConfig,
      {
        pageSize: 20,
        background: true,
        pageSizes: [10, 20, 30, 50, 100, 200],
        className: 'mt-2 w-full',
        layouts: isMobile.value ? mobileLayouts : layouts,
        size: 'mini' as const,
      },
    );
  }
  if (mergedOptions.formConfig) {
    mergedOptions.formConfig.enabled = false;
  }
  if (tableData.value && tableData.value.length > 0) {
    mergedOptions.data = tableData.value;
  }

  // 注入已读行功能（rowClassName、rowStyle、columns 拦截）
  if (viewedRowOptions.value && gridApi.viewedRowHelper) {
    applyViewedRowOptions(
      mergedOptions,
      viewedRowOptions.value,
      gridApi.viewedRowHelper,
    );
  }

  return mergedOptions;
});

function onToolbarToolClick(event: VxeGridDefines.ToolbarToolClickEventParams) {
  if (event.code === 'search') {
    onSearchBtnClick();
  }
  (
    gridEvents.value?.toolbarToolClick as VxeGridListeners['toolbarToolClick']
  )?.(event);
}

function onSearchBtnClick() {
  props.api?.toggleSearchForm?.();
}

const events = computed(() => {
  return {
    ...gridEvents.value,
    toolbarToolClick: onToolbarToolClick,
  };
});

const delegatedSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (
      ![
        'bottom',
        'empty',
        'form',
        'loading',
        TOOLBAR_ACTIONS,
        TOOLBAR_TOOLS,
        'top',
      ].includes(key)
    ) {
      resultSlots.push(key);
    }
  }
  return resultSlots;
});

const delegatedFormSlots = computed(() => {
  const resultSlots: string[] = [];

  for (const key of Object.keys(slots)) {
    if (key.startsWith(FORM_SLOT_PREFIX)) {
      resultSlots.push(key);
    }
  }
  return resultSlots.map((key) => key.replace(FORM_SLOT_PREFIX, ''));
});

const showDefaultEmpty = computed(() => {
  // 检查是否有原生的 VXE Table 空状态配置
  const hasEmptyText = options.value.emptyText !== undefined;
  const hasEmptyRender = options.value.emptyRender !== undefined;

  // 如果有原生配置，就不显示默认的空状态
  return !hasEmptyText && !hasEmptyRender;
});

async function init() {
  await nextTick();
  const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
  const defaultGridOptions: VxeTableGridProps = mergeWithArrayOverride(
    {},
    toRaw(gridOptions.value),
    toRaw(globalGridConfig),
  );
  props.api?.setState?.({ gridOptions: defaultGridOptions });
  // Re-wrap after the option update: a parent may have replaced
  // proxyConfig.ajax callbacks (e.g. via setGridOptions in its onMounted)
  // after the setup-time wrapping. extendProxyOptions is idempotent, so
  // already-wrapped handlers are skipped.
  extendProxyOptions(props.api, toRaw(gridOptions.value) ?? {}, () =>
    formApi.getLatestSubmissionValues(),
  );

  // 内部主动加载数据，防止form的默认值影响
  const autoLoad = defaultGridOptions.proxyConfig?.autoLoad;
  const enableProxyConfig = options.value.proxyConfig?.enabled;
  if (enableProxyConfig && autoLoad) {
    // Wait for VXE to receive the latest options before applying default sort.
    await nextTick();
    props.api.grid.commitProxy?.(
      'initial',
      formOptions.value ? ((await formApi.getValues()) ?? {}) : {},
    );
  }

  // form 由 vben-form代替，所以不适配formConfig，这里给出警告
  const formConfig = gridOptions.value?.formConfig;
  // 处理某个页面加载多个Table时，第2个之后的Table初始化报出警告
  // 因为第一次初始化之后会把defaultGridOptions和gridOptions合并后缓存进State
  if (formConfig && formConfig.enabled) {
    console.warn(
      '[Vben Vxe Table]: The formConfig in the grid is not supported, please use the `formOptions` props',
    );
  }
}

// formOptions支持响应式
watch(
  formOptions,
  () => {
    formApi.setState((prev: Record<string, any>) => {
      const finalFormOptions: VbenFormProps = mergeWithArrayOverride(
        {},
        formOptions.value,
        prev,
      );
      return {
        ...finalFormOptions,
        collapseTriggerResize: !!finalFormOptions.showCollapseButton,
      };
    });
  },
  {
    immediate: true,
  },
);

// form 由 vben-form 代替，所以需要保证 query 相关事件可以拿到参数。
// 在 setup 阶段同步包装（而不是在 init 中）：init 首行 await nextTick，
// 晚于父组件的 onMounted，父组件挂载时调用 query()/reload() 会命中未包装的 ajax。
// 包装范围与 init 的 defaultGridOptions 一致（gridOptions + 全局 grid 配置）。
extendProxyOptions(
  props.api,
  mergeWithArrayOverride(
    {},
    toRaw(gridOptions.value),
    toRaw(VxeUI?.getConfig()?.grid ?? {}),
  ),
  () => formApi.getLatestSubmissionValues(),
);

// init 之后业务仍可能通过 api.setGridOptions()/setState() 替换 proxyConfig.ajax
// 回调。监听 ajax 引用变化并重新包装（幂等）：新回调恢复表单值注入，同时把
// 表单值 getter 刷新为当前挂载实例（重新挂载时旧 wrapper 会被复用）。
watch(
  () => toRaw(gridOptions.value)?.proxyConfig?.ajax,
  (ajax) => {
    if (!ajax) {
      return;
    }
    extendProxyOptions(props.api, { proxyConfig: { ajax } }, () =>
      formApi.getLatestSubmissionValues(),
    );
  },
);

// ===== 通栏扩展测量与尺寸失效处理 =====

const formShellRef = useTemplateRef<HTMLElement>('formShellRef');

function getGridEl(): HTMLElement | null {
  const el = (gridRef.value as unknown as { $el?: HTMLElement })?.$el;
  return el instanceof HTMLElement ? el : null;
}

let layoutActive = false;
let bleedFrame = 0;
let bleedObserver: null | ResizeObserver = null;

/**
 * 通栏扩展量来自 VxeGrid 根节点实际内边距(响应 gridClass/全屏等变化),
 * 对比新旧值后才写入壳层 CSS 变量,rAF 合并更新
 */
function scheduleBleedUpdate() {
  if (!layoutActive || !isBleedActive.value || bleedFrame) {
    return;
  }
  bleedFrame = requestAnimationFrame(() => {
    bleedFrame = 0;
    if (!layoutActive || !isBleedActive.value) {
      return;
    }
    const gridEl = getGridEl();
    const shell = formShellRef.value;
    if (!gridEl || !shell) {
      return;
    }
    const { paddingLeft, paddingRight } = getComputedStyle(gridEl);
    const paddings = [
      [GRID_SEPARATOR_BLEED_LEFT_VAR, paddingLeft],
      [GRID_SEPARATOR_BLEED_RIGHT_VAR, paddingRight],
    ] as const;
    for (const [variable, padding] of paddings) {
      const next = Number.parseFloat(padding) > 0 ? padding : '0px';
      if (shell.style.getPropertyValue(variable) !== next) {
        shell.style.setProperty(variable, next);
      }
    }
  });
}

const isBleedActive = computed(
  () => separatorFullBleed.value && isSeparator.value && !!formOptions.value,
);

function syncBleedObserver() {
  const gridEl = getGridEl();
  if (layoutActive && isBleedActive.value && gridEl) {
    if (!bleedObserver && typeof ResizeObserver !== 'undefined') {
      // padding 变化通常伴随根节点尺寸变化(height: auto),RO 作为补充触发源
      bleedObserver = new ResizeObserver(scheduleBleedUpdate);
    }
    bleedObserver?.observe(gridEl);
  } else {
    bleedObserver?.disconnect();
  }
}

watch(
  [isBleedActive, gridClass, formShellRef],
  () => {
    syncBleedObserver();
    scheduleBleedUpdate();
  },
  { flush: 'post' },
);

/**
 * 尺寸失效处理:搜索显隐、模式/配置切换由 watch 覆盖;
 * 表单收起/校验提示等高度变化由壳层尺寸观察覆盖。
 * 仅重算布局,不重建 Grid、不重查数据
 */
let recalcFrame = 0;

function scheduleRecalculate() {
  if (!layoutActive || recalcFrame) {
    return;
  }
  // 将配置 watcher 与 ResizeObserver 的失效通知合并到同一帧。
  recalcFrame = requestAnimationFrame(() => {
    recalcFrame = 0;
    if (layoutActive) {
      gridApi.grid?.recalculate?.(true);
    }
  });
}

let shellObserver: null | ResizeObserver = null;
let observedShell: HTMLElement | null = null;

function syncShellObserver() {
  const shell = formShellRef.value;
  if (layoutActive && shell === observedShell) {
    return;
  }
  shellObserver?.disconnect();
  observedShell = null;
  if (!layoutActive || !shell || typeof ResizeObserver === 'undefined') {
    return;
  }
  shellObserver ??= new ResizeObserver((entries) => {
    if (entries.some(({ target }) => target === observedShell)) {
      scheduleRecalculate();
    }
  });
  observedShell = shell;
  shellObserver.observe(shell, { box: 'border-box' });
}

watch(
  formShellRef,
  () => {
    syncShellObserver();
    scheduleRecalculate();
  },
  { flush: 'post' },
);

watch(
  [
    showSearchForm,
    segmentedMode,
    isSeparator,
    () => gridSectionVars.value[GRID_SECTION_GAP_VAR],
  ],
  () => {
    scheduleRecalculate();
  },
  { flush: 'post' },
);

// 背景色和圆角不影响几何尺寸。表单字段、分隔条 class/style 等实际
// 引起的尺寸变化交给壳层观察,避免监听整个配置对象而重算整张表格。

function startLayoutObservers() {
  if (layoutActive) {
    return;
  }
  layoutActive = true;
  syncShellObserver();
  syncBleedObserver();
  scheduleBleedUpdate();
  scheduleRecalculate();
}

function stopLayoutObservers() {
  layoutActive = false;
  bleedObserver?.disconnect();
  shellObserver?.disconnect();
  observedShell = null;
  if (bleedFrame) {
    cancelAnimationFrame(bleedFrame);
    bleedFrame = 0;
  }
  if (recalcFrame) {
    cancelAnimationFrame(recalcFrame);
    recalcFrame = 0;
  }
}

// 分段布局契约:zone/card 或显式下段配置时校验有效 layouts(含全局配置合并结果)。
// 监听源用签名而不是引用:options 每次重算都会 cloneDeep 出新的 layouts 数组,
// 引用恒变;签名字符串保证仅在内容或分段开关真实变化时才校验/告警
watch(
  () => {
    if (!isGridSectioned.value) {
      return 'off';
    }
    return JSON.stringify(toRaw(options.value)?.layouts ?? null);
  },
  (signature) => {
    if (signature === 'off') {
      return;
    }
    const problems = validateSectionLayouts(JSON.parse(signature));
    for (const problem of problems) {
      console.warn(
        `[Vben Vxe Table]: Segmented layout constraint violated: ${problem}. Disable segmented or adjust gridOptions.layouts.`,
      );
    }
  },
  { immediate: true },
);

onMounted(() => {
  props.api?.mount?.(gridRef.value, formApi);
  init();
  startLayoutObservers();
});

onActivated(startLayoutObservers);
onDeactivated(stopLayoutObservers);
onBeforeUnmount(stopLayoutObservers);

onUnmounted(() => {
  bleedObserver = null;
  shellObserver = null;
  formApi?.unmount?.();
  props.api?.unmount?.();
});
</script>

<template>
  <div
    :class="
      cn(
        'h-full rounded-md bg-card',
        segmentedMode === 'card' && 'bg-transparent',
        className,
      )
    "
  >
    <VxeGrid
      ref="gridRef"
      :class="
        cn(
          // card 模式下两卡内边距自洽(surface p-2 / body padding-inline /
          // pager-wrapper padding),根节点 padding 归零使卡片与其他布局
          // 占据相同外廓;其余模式 p-2 作为卡片内部内边距
          segmentedMode === 'card' ? 'p-0' : 'p-2',
          {
            'pt-0':
              options.toolbarConfig &&
              options.toolbarConfig.enabled !== false &&
              (!formOptions || showSearchForm === false),
          },
          gridClass,
        )
      "
      :data-vben-grid-sectioned="isGridSectioned ? segmentedMode : undefined"
      data-vben-grid
      :data-vben-grid-top-inset="needsBodyTopInset || undefined"
      :style="gridSectionVars"
      v-bind="options"
      v-on="events"
    >
      <!-- 左侧操作区域或者title -->
      <template v-if="showToolbar" #toolbar-actions="slotProps">
        <slot v-if="showTableTitle" name="table-title">
          <div class="flex-center gap-1 text-[1rem] font-bold">
            {{ tableTitle }}
            <VbenHelpTooltip v-if="tableTitleHelp">
              {{ tableTitleHelp }}
            </VbenHelpTooltip>
          </div>
        </slot>
        <slot name="toolbar-actions" v-bind="slotProps"> </slot>
      </template>

      <!-- 继承默认的slot -->
      <template
        v-for="slotName in delegatedSlots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
      <template #toolbar-tools="slotProps">
        <slot name="toolbar-tools" v-bind="slotProps"></slot>
        <VxeButton
          icon="vxe-icon-search"
          circle
          class="ml-2"
          v-if="gridOptions?.toolbarConfig?.search && !!formOptions"
          :status="showSearchForm ? 'primary' : undefined"
          :title="$t('common.search')"
          @click="onSearchBtnClick"
        />
      </template>

      <!-- 无工具栏/分页器时仍保留可被 VXE 纳入高度测量的卡片边缘。 -->
      <template v-if="needsBodyTopInset || slots.top" #top="slotProps">
        <slot name="top" v-bind="slotProps"></slot>
      </template>
      <template
        v-if="segmentedMode === 'card' || slots.bottom"
        #bottom="slotProps"
      >
        <slot name="bottom" v-bind="slotProps"></slot>
      </template>

      <!-- form表单:壳层 -> [表单表面 + 分隔区] -->
      <template #form>
        <div
          v-if="formOptions"
          v-show="showSearchForm !== false"
          ref="formShellRef"
          class="flow-root"
        >
          <div :class="surfaceClass" :style="surfaceStyle">
            <slot name="form">
              <Form
                class="[--vben-form-compact-padding:0px] [--vben-form-compact-row-gap:0.5rem]"
              >
                <template
                  v-for="slotName in delegatedFormSlots"
                  :key="slotName"
                  #[slotName]="slotProps"
                >
                  <slot
                    :name="`${FORM_SLOT_PREFIX}${slotName}`"
                    v-bind="slotProps"
                  ></slot>
                </template>
                <template #reset-before="slotProps">
                  <slot name="reset-before" v-bind="slotProps"></slot>
                </template>
                <template #submit-before="slotProps">
                  <slot name="submit-before" v-bind="slotProps"></slot>
                </template>
                <template #expand-before="slotProps">
                  <slot name="expand-before" v-bind="slotProps"></slot>
                </template>
                <template #expand-after="slotProps">
                  <slot name="expand-after" v-bind="slotProps"></slot>
                </template>
              </Form>
            </slot>
          </div>
          <!-- 分隔区 -->
          <div v-if="isSeparatorZoneVisible" :style="separatorZoneStyle">
            <div
              v-if="isSeparator"
              aria-hidden="true"
              :class="separatorStripClass"
              :style="separatorStyle"
            ></div>
          </div>
        </div>
      </template>
      <!-- loading -->
      <template #loading>
        <slot name="loading">
          <VbenLoading :spinning="true" />
        </slot>
      </template>
      <!-- 统一控状态 -->
      <template v-if="showDefaultEmpty" #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">{{ $t('common.noData') }}</div>
        </slot>
      </template>
    </VxeGrid>
  </div>
</template>
