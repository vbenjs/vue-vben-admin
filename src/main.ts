import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import '/@/design/index.less';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';

async function bootstrap() {
  const app = createApp(App);

  // Configure store 数据store配置
  setupStore(app);

  // Initialize internal system configuration  初始化系统内部配置
  initAppConfigStore();

  // Register global components  全局注册组件
  registerGlobComp(app);

  // Multilingual configuration  国际语言
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing 挂载路由
  setupRouter(app);

  // router-guard
  setupRouterGuard(router); // 路由守卫

  // Register global directive  自定义指令全局注册？？
  setupGlobDirectives(app);

  // Configure global error handling  全局异常处理
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.mount('#app');
}

bootstrap();
