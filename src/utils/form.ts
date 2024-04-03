import { useI18n } from '@/hooks/web/useI18n';

/**
 * 获取启用停用下拉列
 */
export const getUseYnSelectOptions = () => {
  const { t } = useI18n();
  return [
    {
      label: t('common.form.use'),
      value: 1,
    },
    {
      label: t('common.form.noUse'),
      value: 0,
    },
  ];
};
