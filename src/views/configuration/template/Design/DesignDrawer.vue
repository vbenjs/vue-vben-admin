<template>
  <PageWrapper>
    <Card>
      <div class="flex justify-between mb-4">
        <div class="flex">
          <!-- 纸张设置 -->
          <Segmented
            class="mr-2"
            v-model:value="curPaper.type"
            :options="paperOptions"
            @change="(value) => setPaper(value as PaperType)"
          />

          <div v-if="curPaper.type === 'other'" class="mr-2">
            <InputGroup compact>
              <Input
                type="number"
                v-model:value="curPaper.width"
                style="width: 100px; text-align: center"
                placeholder="宽"
                suffix="mm"
              />
              <Input
                style="width: 30px; border-left: 0; background: #fff; pointer-events: none"
                placeholder="~"
                disabled
              />
              <Input
                type="number"
                v-model:value="curPaper.height"
                style="width: 100px; border-left: 0; text-align: center"
                placeholder="高"
                suffix="mm"
              />
            </InputGroup>
          </div>

          <div class="w-30 mr-2">
            <InputNumber
              :value="curPaper.scale"
              :min="scaleMin"
              :max="scaleMax"
              disabled
              :formatter="(value) => `${(Number(value) * 100).toFixed(0)}%`"
              style="width: 70px"
            >
              <template #addonBefore>
                <Icon
                  icon="ant-design:zoom-out-outlined"
                  @click="() => methods?.changeScale?.(false)"
                  class="mx-[-11px] px-11px py-4px"
                />
              </template>
              <template #addonAfter>
                <Icon
                  icon="ant-design:zoom-in-outlined"
                  @click="() => methods?.changeScale?.(true)"
                  class="mx-[-11px] px-11px py-4px"
                />
              </template>
            </InputNumber>
          </div>
        </div>

        <Space.Compact>
          <!-- 预览/打印 -->
          <Button @click="() => methods.preview?.()">
            <Icon type="link" icon="ant-design:eye-outlined" />
          </Button>

          <!-- 保存/清空 -->
          <Button @click="save">
            <Icon icon="ant-design:save-outlined" />
          </Button>

          <Popconfirm title="是否确认清空?" okType="danger" okText="确定" @confirm="methods.clear">
            <Button>
              <Icon icon="ant-design:delete-outlined" color="red" />
            </Button>
          </Popconfirm>
          <Button @click="methods.previewJson">
            <Icon icon="codicon:json" />
          </Button>
        </Space.Compact>
      </div>
      <Space.Compact class="mb-4">
        <Button title="左对齐" @click="setElsAlign('left')">
          <Icon icon="clarity:align-left-line" />
        </Button>
        <Button title="居中" @click="setElsAlign('vertical')">
          <Icon icon="clarity:align-center-line" />
        </Button>
        <Button title="右对齐" @click="setElsAlign('right')">
          <Icon icon="clarity:align-right-line" />
        </Button>
        <Button title="顶部对齐" @click="setElsAlign('top')">
          <Icon icon="clarity:align-top-line" />
        </Button>
        <Button title="垂直居中" @click="setElsAlign('horizontal')">
          <Icon icon="clarity:align-middle-line" />
        </Button>
        <Button title="底部对齐" @click="setElsAlign('bottom')">
          <Icon icon="clarity:align-bottom-line" />
        </Button>
        <Button title="横向分散" @click="setElsAlign('distributeHor')">
          <Icon icon="carbon:pan-horizontal" />
        </Button>
        <Button title="纵向分散" @click="setElsAlign('distributeVer')">
          <Icon icon="carbon:pan-vertical" />
        </Button>
      </Space.Compact>

      <div class="flex">
        <Card class="card-element" size="small">
          <div class="rect-printElement-types hiprintEpContainer"></div>
        </Card>

        <Card class="card-design" size="small">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </Card>
        <div class="params_setting_container">
          <Card class="card-setting" size="small">
            <div class="hinnn-layout-sider">
              <div id="PrintElementOptionSetting"></div>
            </div>
          </Card>
        </div>
      </div>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import {
    getPrintTemplateById,
    updatePrintTemplateContent,
  } from '@/api/configuration/printTemplate';
  import { Card, Space, Button, Input, Popconfirm, InputNumber, Segmented } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import {
    useHiPrint,
    paperTypes,
    paperOptions,
    defaultOtherPaper,
    scaleMax,
    scaleMin,
  } from '@/components/PrintDesign';
  import fontSize from './font-size';
  import zIndex from './zIndex';
  import imageSrc from './image-src';

  import { provider } from './provider';
  import { useRoute } from 'vue-router';
  import { Paper, PaperType } from '@/components/PrintDesign/src/typing';
  import { PageWrapper } from '@/components/Page';
  import { getProvider } from '@/api/others/provider';
  import { useMessage } from '@/hooks/web/useMessage';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { useTabs } from '@/hooks/web/useTabs';

  defineOptions({ name: 'UpdatePrintTemplate' });

  const rowId = ref<number>(0);

  const InputGroup = Input.Group;
  const route = useRoute();
  const { refreshPage } = useTabs();
  const { createMessage: msg, createConfirm } = useMessage();

  // 当前纸张
  const curPaper = ref<Paper>({
    type: 'A4',
    width: 0,
    height: 0,
    scale: 1,
  });

  let hiprintTemplate: any = null;
  const methods = reactive<{
    print?: Fn;
    preview?: Fn;
    clear?: Fn;
    previewJson?: Fn;
    changeScale?: Fn;
  }>({});

  const init = (content: string = '', text: string, list: any[]) => {
    try {
      const [template, { print, preview, clear, previewJson, changeScale }] = useHiPrint({
        provider: {
          value: 'aProviderModule',
          f: provider('aProviderModule', text, list),
        },
        designEleId: '#hiprint-printTemplate',
        settingContainer: '#PrintElementOptionSetting',
        printElementContainer: '.hiprintEpContainer',
        paper: curPaper,
        panel: JSON.parse(content || '{}'),
        config: {
          optionItems: [fontSize, zIndex, imageSrc],
          movingDistance: 2.5,
          text: {
            supportOptions: [
              {
                name: 'styler',
                hidden: true,
              },
              {
                name: 'scale', // 自定义参数，supportOptions 必须得添加
                after: 'transform', // 自定义参数，插入在 transform 之后
                hidden: false,
              },
              {
                name: 'formatter',
                hidden: true,
              },
            ],
          },
          image: {
            tabs: [
              {
                // 整体替换
                // replace: true,
                name: '基本',
                options: [
                  {
                    name: 'field',
                    hidden: false,
                  },
                  {
                    name: 'src',
                    hidden: false,
                  },
                  {
                    name: 'fit',
                    hidden: false,
                  },
                ],
              },
            ],
          },
        },
      });
      hiprintTemplate = template;
      methods.print = print;
      methods.preview = preview;
      methods.clear = clear;
      methods.previewJson = previewJson;
      methods.changeScale = changeScale;
      // hiprint.init({
      //   providers: [provider.f],
      // });
      // $('.hiprintEpContainer').empty();
      // hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
      // $('#hiprint-printTemplate').empty();
      // hiprintTemplate = new hiprint.PrintTemplate({
      //   settingContainer: '#PrintElementOptionSetting',
      //   // paginationContainer: '.hiprint-printPagination',
      // });
      // hiprintTemplate.design('#hiprint-printTemplate');
      // console.log(hiprintTemplate);
      // // 获取当前放大比例, 当zoom时传true 才会有
    } catch (error) {
      createConfirm({
        iconType: 'error',
        title: '加载模板错误',
        content: '当前模板加载错误，点击确定将会复制当前模板JSON到剪切板，并清空模板，是否继续？',
        onOk: async () => {
          await copyText(content, null);
          init('', text, list);
        },
      });
    }
  };

  const setPaper = (key: PaperType) => {
    const paper = paperTypes[key] ? paperTypes[key] : defaultOtherPaper;
    curPaper.value.type = key;
    curPaper.value.width = paper.width;
    curPaper.value.height = paper.height;
  };

  const save = async () => {
    const json = hiprintTemplate?.getJson();
    await updatePrintTemplateContent(rowId.value, JSON.stringify(json));
    msg.success('保存成功');
  };

  onMounted(async () => {
    const id = Number(route.query.id);
    rowId.value = id;
    const { content, templateType } = await getPrintTemplateById(id);
    let type = '';
    let text = '';

    switch (templateType) {
      case 'PALLET':
      case 'PALLET_R':
        type = 'Pallet';
        text = '托';
        break;
      case 'BOX':
      case 'BOX_R':
      case 'PACKAGE':
      case 'PACKAGE_R':
        type = 'Box';
        text = '盒/箱';
        break;
      default:
        type = 'Bill';
        text = '单据';
        break;
    }

    const list = await getProvider(type as any);

    init(content, text, list);
  });
  const setElsAlign = (e) => {
    hiprintTemplate.setElsAlign(e);
  };
</script>
<style lang="less" scoped>
  // build 拖拽
  :deep(.rect-printElement-types .hiprint-printElement-type > li > ul > li > a) {
    // width: 80px;
    height: auto;
    padding: 4px;
    color: #1296db;
    line-height: 1;
    text-overflow: ellipsis;
  }

  // // 默认图片
  // :deep(.hiprint-printElement-image-content) {
  //   img {
  //     content: url('~@/assets/images/logo.png');
  //   }
  // }
  .card-element {
    width: 15rem;
    height: calc(100vh - 260px);
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }

  // 设计容器
  .card-design {
    width: calc(100% - 35rem);
    height: calc(100vh - 260px);
    margin: 0 1rem;
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }

  .card-setting {
    width: 20rem;
    height: calc(100vh - 260px);
    overflow: hidden;
    overflow-x: auto;
    overflow-y: auto;
  }

  // 默认图片
  :deep(.del-btn) {
    display: none !important;
  }
</style>
