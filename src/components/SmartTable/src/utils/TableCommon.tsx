import { Tag } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { SmartColumn } from '@/components/SmartTable';

/**
 * Boolean列配置
 * @param t
 * @param title
 * @param field
 */
export const tableBooleanColumn = (t: Function, title: string, field: string) => {
  const createSlot = ({ row }: any) => {
    const value = row[field];
    if (value === true) {
      return <Tag color="#108ee9">{t('common.form.yes')}</Tag>;
    }
    return <Tag color="#f50">{t('common.form.no')}</Tag>;
  };
  /**
   * 创建列信息
   */
  const createColumn = () => {
    return {
      title: title,
      field: field,
      width: 100,
      slots: {
        default: createSlot,
      },
    };
  };
  return {
    createColumn,
  };
};

const tableDeleteYn = (t: Function) => {
  const createSlot = ({ row }: any) => {
    const value = row.deleteYn;
    if (value === false) {
      return <Tag color="#108ee9">{t('common.form.no')}</Tag>;
    }
    return <Tag color="#f50">{t('common.form.yes')}</Tag>;
  };
  /**
   * 创建列信息
   */
  const createColumn = () => {
    return {
      title: '{common.table.deleteYn}',
      field: 'deleteYn',
      width: 100,
      slots: {
        default: createSlot,
      },
    };
  };
  return {
    createColumn,
  };
};

const tableUseYn = (t: Function) => {
  const createSlot = ({ row }: any) => {
    const useYn = row.useYn;
    if (useYn === true) {
      return <Tag color="#108ee9">{t('common.form.use')}</Tag>;
    }
    return <Tag color="#f50">{t('common.form.noUse')}</Tag>;
  };
  /**
   * 创建列信息
   */
  const createColumn = () => {
    return {
      title: '{common.table.useYn}',
      field: 'useYn',
      width: 100,
      slots: {
        default: createSlot,
      },
    };
  };

  return {
    createColumn,
  };
};

const tableUseYnClass = (): SmartColumn => {
  const { t } = useI18n();

  return {
    title: '{common.table.useYn}',
    field: 'useYn',
    width: 100,
    formatter: ({ row }) => {
      const useYn = row.useYn as boolean | null;
      if (useYn === null) {
        return '';
      }
      return useYn ? t('common.form.use') : t('common.form.noUse');
    },
    dynamicClass: ({ row }) => {
      const useYn = row.useYn as boolean | null;
      if (useYn === null) {
        return '';
      }
      return useYn ? 'text-color--success-bold' : 'text-color--danger-bold';
    },
  };
};

export { tableUseYn, tableDeleteYn, tableUseYnClass };
