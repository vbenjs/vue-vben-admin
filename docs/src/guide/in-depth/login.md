# 登录

本文介绍如何去改造自己的应用程序登录页。

## 登录页面调整

如果你想调整登录页面的标题、描述和图标以及工具栏，你可以通过配置 `AuthPageLayout` 组件的 `props` 参数来实现。

![login](/guide/login.png)

只需要在应用下的 `src/router/routes/core.ts` 内，配置`AuthPageLayout`的 `props`参数即可：

```ts {4-8}
 {
    component: AuthPageLayout,
    props: {
      sloganImage: "xxx/xxx.png",
      pageTitle: "开箱即用的大型中后台管理系统",
      pageDescription: "工程化、高性能、跨组件库的前端模版",
      toolbar: true,
      toolbarList: () => ['color', 'language', 'layout', 'theme'],
    }
    // ...
  },
```

::: tip

如果这些配置不能满足你的需求，你可以自行实现登录页面。直接实现自己的 `AuthPageLayout`即可。

:::

## 登录表单调整

如果你想调整登录表单的相关内容，你可以在应用下的 `src/views/_core/authentication/login.vue` 内，配置`AuthenticationLogin` 组件参数即可：

```vue
<AuthenticationLogin
  :loading="authStore.loginLoading"
  password-placeholder="123456"
  username-placeholder="vben"
  @submit="authStore.authLogin"
/>
```

::: details AuthenticationLogin 组件参数

```ts
{
  /**
   * @zh_CN 验证码登录路径
   */
  codeLoginPath?: string;
  /**
   * @zh_CN 忘记密码路径
   */
  forgetPasswordPath?: string;

  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;

  /**
   * @zh_CN 密码占位符
   */
  passwordPlaceholder?: string;

  /**
   * @zh_CN 二维码登录路径
   */
  qrCodeLoginPath?: string;

  /**
   * @zh_CN 注册路径
   */
  registerPath?: string;

  /**
   * @zh_CN 是否显示验证码登录
   */
  showCodeLogin?: boolean;
  /**
   * @zh_CN 是否显示忘记密码
   */
  showForgetPassword?: boolean;

  /**
   * @zh_CN 是否显示二维码登录
   */
  showQrcodeLogin?: boolean;

  /**
   * @zh_CN 是否显示注册按钮
   */
  showRegister?: boolean;

  /**
   * @zh_CN 是否显示记住账号
   */
  showRememberMe?: boolean;

  /**
   * @zh_CN 是否显示第三方登录
   */
  showThirdPartyLogin?: boolean;

  /**
   * @zh_CN 登录框子标题
   */
  subTitle?: string;

  /**
   * @zh_CN 登录框标题
   */
  title?: string;

  /**
   * @zh_CN 用户名占位符
   */
  usernamePlaceholder?: string;
}
```

:::

::: tip

如果这些配置不能满足你的需求，你可以自行实现登录表单及相关登录逻辑。

:::
