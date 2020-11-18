import type { BasicColumn, ActionItem } from '/@/components/Table';

import { FileItem, PreviewFileItem, UploadResultStatus } from './types';
import { checkImgType, isImgTypeByName } from './utils';
import { Progress, Tag } from 'ant-design-vue';

import TableAction from '/@/components/Table/src/components/TableAction';

// 文件上传列表
export function createTableColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'thumbUrl',
      title: '图例',
      width: 100,
      customRender: ({ record }) => {
        const { thumbUrl, type } = (record as FileItem) || {};
        return <span>{thumbUrl ? <img style={{ maxWidth: '100%' }} src={thumbUrl} /> : type}</span>;
      },
    },
    {
      dataIndex: 'name',
      title: '文件名',
      align: 'left',
      customRender: ({ text, record }) => {
        const { percent, status: uploadStatus } = (record as FileItem) || {};
        let status: 'normal' | 'exception' | 'active' | 'success' = 'normal';
        if (uploadStatus === UploadResultStatus.ERROR) {
          status = 'exception';
        } else if (uploadStatus === UploadResultStatus.UPLOADING) {
          status = 'active';
        } else if (uploadStatus === UploadResultStatus.SUCCESS) {
          status = 'success';
        }
        return (
          <span>
            <p class="ellipsis mb-1" title={text}>
              {text}
            </p>
            <Progress percent={percent} size="small" status={status} />
          </span>
        );
      },
    },
    {
      dataIndex: 'size',
      title: '文件大小',
      width: 100,
      customRender: ({ text = 0 }) => {
        return text && (text / 1024).toFixed(2) + 'KB';
      },
    },
    // {
    //   dataIndex: 'type',
    //   title: '文件类型',
    //   width: 100,
    // },
    {
      dataIndex: 'status',
      title: '状态',
      width: 100,
      customRender: ({ text }) => {
        if (text === UploadResultStatus.SUCCESS) {
          return <Tag color="green">{() => '上传成功'}</Tag>;
        } else if (text === UploadResultStatus.ERROR) {
          return <Tag color="red">{() => '上传失败'}</Tag>;
        } else if (text === UploadResultStatus.UPLOADING) {
          return <Tag color="blue">{() => '上传中'}</Tag>;
        }

        return text;
      },
    },
  ];
}
export function createActionColumn(handleRemove: Function, handlePreview: Function): BasicColumn {
  return {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      const actions: ActionItem[] = [
        {
          label: '删除',
          color: 'error',
          onClick: handleRemove.bind(null, record),
        },
      ];
      if (checkImgType(record)) {
        actions.unshift({
          label: '预览',
          onClick: handlePreview.bind(null, record),
        });
      }
      return <TableAction actions={actions} />;
    },
  };
}
// 文件预览列表
export function createPreviewColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'url',
      title: '图例',
      width: 100,
      customRender: ({ record }) => {
        const { url, type } = (record as PreviewFileItem) || {};
        return (
          <span>{isImgTypeByName(url) ? <img src={url} style={{ width: '50px' }} /> : type}</span>
        );
      },
    },
    {
      dataIndex: 'name',
      title: '文件名',
      align: 'left',
    },
  ];
}

export function createPreviewActionColumn({
  handleRemove,
  handlePreview,
  handleDownload,
}: {
  handleRemove: Fn;
  handlePreview: Fn;
  handleDownload: Fn;
}): BasicColumn {
  return {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    fixed: false,
    customRender: ({ record }) => {
      const { url } = (record || {}) as PreviewFileItem;

      const actions: ActionItem[] = [
        {
          label: '删除',
          color: 'error',
          onClick: handleRemove.bind(null, record),
        },
        {
          label: '下载',
          onClick: handleDownload.bind(null, record),
        },
      ];
      if (isImgTypeByName(url)) {
        actions.unshift({
          label: '预览',
          onClick: handlePreview.bind(null, record),
        });
      }
      return <TableAction actions={actions} />;
    },
  };
}
