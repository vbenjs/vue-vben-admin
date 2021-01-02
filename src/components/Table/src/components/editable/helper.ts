import { ComponentType } from '../../types/componentType';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

/**
 * @description: 生成placeholder
 */
export function createPlaceholderMessage(component: ComponentType) {
  if (component.includes('Input')) {
    return t('component.form.input');
  }
  if (component.includes('Picker')) {
    return t('component.form.choose');
  }

  if (
    component.includes('Select') ||
    component.includes('Checkbox') ||
    component.includes('Radio') ||
    component.includes('Switch')
  ) {
    return t('component.form.choose');
  }
  return '';
}
