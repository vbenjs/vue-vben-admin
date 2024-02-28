1、代码gitee地址


2、环境及版本说明
vue版本： 3.3.4

3、代码目录结构  
├── build  // 打包配置
├── public  // 静态资源
├── src // 项目代码
│   ├── api
│   ├── assets
│   ├── components
│   ├── design
│   ├── directives
│   ├── enums
│   ├── hooks
│   ├── layouts
│   ├── locales
│   ├── logics
│   ├── router
│   ├── settings
│   ├── store
│   └── views
│       ├── cloud
│       ├── course
│       ├── dashboard
│       ├── mobile
│       ├── report
│       ├── staff
│       ├── student
│       ├── sys
│       └── system
├── tests
├── stylelint.config.js
├── tsconfig.json
├── types
├── vite.config.ts
└── windi.config.ts


4、项目运行配置  
安装依赖 pnpm install  
启动项目 pnpm  dev  
打包项目 pnpm  build  

5、项目部分配置  
在env文件夹下，根据环境配置对应的配置文件，如.env.development、.env.production等  
VITE_PUBLIC_PATH 为项目打包后的静态资源路径，如：/  
VITE_GLOB_API_URL为项目接口请求地址，如：/api/  
打包路径配置： build/constants.ts 中的OUTPUT_DIR  


 