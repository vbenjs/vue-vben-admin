import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { flushPromises } from '@vue/test-utils';
import { createApp, nextTick } from 'vue';
import Login from '../Login.vue';
import { router } from '/@/router';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import App from '../../../../App.vue';
import { setupI18n } from '/@/locales/setupI18n';
import { Modal } from 'ant-design-vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { SPECIFIED_HOME_PATH } from './../../../../../tests/setup';

let pinia;
let wrapper;
describe('登录测试', () => {
  beforeEach(async () => {
    /* @ts-ignore */
    vi.spyOn(global, 'setTimeout').mockReturnValue(new Date().getTime());
    document.body.innerHTML = '';
    const app = createApp(App);
    pinia = createTestingPinia({ stubActions: false });
    app.use(pinia);
    await setupI18n(app);
    initAppConfigStore();
    wrapper = mount(Login, {
      global: {
        plugins: [pinia, router],
      },
    });
  });
  it('用户名和密码都不输入时,显示提示内容', async () => {
    const loginBtn = wrapper.get('.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-block');
    const loginNameInput = wrapper.find('input[id=form_item_account]');
    const passwordInput = wrapper.find('#form_item_password');
    await loginNameInput.setValue('');
    await passwordInput.setValue('');
    await flushPromises();
    await nextTick();
    const formItems = wrapper.findAll('.ant-row.ant-form-item');
    const accountEle = formItems[0];
    const passwordEle = formItems[1];
    expect(accountEle.classes()).contains('ant-form-item-has-error');
    expect(passwordEle.classes()).contains('ant-form-item-has-error');
    expect(loginBtn.text()).eq('登 录');
  });
  it('用户名和密码输入错误时,提示用户名密码错误', async () => {
    const errorModalSpy = vi.spyOn(Modal, 'error');
    const loginBtn = wrapper.get('.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-block');
    const loginNameInput = wrapper.find('input[id=form_item_account]');
    const passwordInput = wrapper.find('#form_item_password');
    await loginNameInput.setValue('22');
    await passwordInput.setValue('33');
    await loginBtn.trigger('click');
    await flushPromises();
    expect(errorModalSpy).toBeCalled();
  });
  it('用户名和密码输入正确时进入到接口指定页面', async () => {
    const { notification } = useMessage();
    const successTipSpy = vi.spyOn(notification, 'success');
    const mockReplace = vi.spyOn(router, 'replace').mockImplementationOnce(() => {
      return Promise.resolve();
    });
    const loginBtn = wrapper.get('.ant-btn.ant-btn-primary.ant-btn-lg.ant-btn-block');
    const loginNameInput = wrapper.find('input[id=form_item_account]');
    const passwordInput = wrapper.find('#form_item_password');
    await loginNameInput.setValue('vben');
    await passwordInput.setValue('123456');
    await loginBtn.trigger('click');
    await flushPromises();
    expect(mockReplace).toBeCalledWith(SPECIFIED_HOME_PATH);
    expect(successTipSpy).toBeCalled();
  });
});
