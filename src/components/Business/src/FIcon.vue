<template>
  <Icon :icon="iconObj.icon" :color="iconObj.color" :size="width * (iconObj.scale ?? 1)" />
</template>

<script lang="ts" setup>
  import { getFileSuffix } from '@/utils/file/file';
  import { computed } from 'vue';
  import { Icon } from '@/components/Icon';
  interface iconIndex {
    [props: string]: {
      icon: string;
      color?: string;
      scale?: number;
    };
  }
  const DocIcon: iconIndex = {
    pdf: {
      icon: 'ci:file-pdf',
      color: '#e6564d',
    },
    xlsx: {
      icon: 'ant-design:file-excel-filled',
      color: '#4BBC4B',
    },
    xls: {
      icon: 'ant-design:file-excel-filled',
      color: '#4BBC4B',
    },
    docx: {
      icon: 'ant-design:file-word-filled',
      color: '#5087e5',
    },
    doc: {
      icon: 'ant-design:file-word-filled',
      color: '#5087e5',
    },
    svg: {
      icon: 'ci:file-image',
      color: '#f96464',
    },
    gif: {
      icon: 'bxs:file-gif',
      color: '#fb7e7e',
    },
    png: {
      icon: 'ci:file-image',
      color: '#f96464',
    },
    jpg: {
      icon: 'ci:file-image',
      color: '#f96464',
    },
    jpeg: {
      icon: 'ci:file-image',
      color: '#f96464',
    },
    txt: {
      icon: 'bxs:file-txt',
      color: '#fdd52d',
    },
    mp4: {
      icon: 'material-symbols:video-file-rounded',
      color: '#8095ff',
    },
    mp3: {
      icon: 'ic:baseline-audio-file',
      color: '#8450ea',
    },

    text: {
      icon: 'bxs:file-txt',
      color: '#fdd52d',
    },
    image: {
      icon: 'ci:file-image',
      color: '#f96464',
    },
    zip: {
      icon: 'bi:file-earmark-zip-fill',
      color: '#fcb233',
      scale: 0.8,
    },
    share_folder: {
      icon: 'vscode-icons:file-type-share_folder',
    },
    folder: {
      icon: 'flat-color-icons:folder',
    },
    folderOpen: {
      icon: 'flat-color-icons:opened-folder',
    },
    unknown: {
      icon: 'ant-design:file-unknown-filled',
      color: '#bbbbbb',
    },
  };

  const props = defineProps({
    fileType: {
      type: String as PropType<string>,
      default: () => '',
    },
    fileName: {
      type: String as PropType<string>,
      default: () => null,
    },
    width: {
      // px
      type: [String, Number] as PropType<string | number>,
    },
  });
  const iconObj = computed(() => {
    let type: string = props.fileType;
    if (!type && props.fileName) {
      type = getFileSuffix(props.fileName);
    }
    return DocIcon[type] ?? DocIcon['unknown'];
  });

  const width = computed(() => {
    const { width } = props;
    if (!width) return 22;
    const newWidth = typeof width === 'string' ? Number(width.slice(0, -2)) : width;
    return newWidth;
  });
</script>

<style lang="less" scoped>
  .norem-icon {
    margin-right: 10px;
    cursor: pointer;
  }
</style>
