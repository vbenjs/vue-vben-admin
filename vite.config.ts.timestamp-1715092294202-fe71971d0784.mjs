// vite.config.ts
import { defineApplicationConfig } from "file:///D:/all_project/vben-admin-pr/internal/vite-config/dist/index.mjs";
import Inspector from "file:///D:/all_project/vben-admin-pr/node_modules/.pnpm/vite-plugin-vue-inspector@5.0.1_vite@5.2.10_@types+node@20.12.7_less@4.2.0_sass@1.75.0_terser@5.30.3_/node_modules/vite-plugin-vue-inspector/dist/index.mjs";
var vite_config_default = defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US"
      ]
    },
    server: {
      proxy: {
        "/basic-api": {
          target: "http://localhost:3000",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), "")
          // only https
          // secure: false
        },
        "/upload": {
          target: "http://localhost:3300/upload",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), "")
        }
      },
      open: true,
      // 项目启动后，自动打开
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"]
      }
    },
    plugins: [
      Inspector({
        openInEditorHost: "http://localhost:5173"
      })
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhbGxfcHJvamVjdFxcXFx2YmVuLWFkbWluLXByXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhbGxfcHJvamVjdFxcXFx2YmVuLWFkbWluLXByXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9hbGxfcHJvamVjdC92YmVuLWFkbWluLXByL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQXBwbGljYXRpb25Db25maWcgfSBmcm9tICdAdmJlbi92aXRlLWNvbmZpZyc7XG5pbXBvcnQgSW5zcGVjdG9yIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1pbnNwZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVBcHBsaWNhdGlvbkNvbmZpZyh7XG4gIG92ZXJyaWRlczoge1xuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgaW5jbHVkZTogW1xuICAgICAgICAnZWNoYXJ0cy9jb3JlJyxcbiAgICAgICAgJ2VjaGFydHMvY2hhcnRzJyxcbiAgICAgICAgJ2VjaGFydHMvY29tcG9uZW50cycsXG4gICAgICAgICdlY2hhcnRzL3JlbmRlcmVycycsXG4gICAgICAgICdxcmNvZGUnLFxuICAgICAgICAnQGljb25pZnkvaWNvbmlmeScsXG4gICAgICAgICdhbnQtZGVzaWduLXZ1ZS9lcy9sb2NhbGUvemhfQ04nLFxuICAgICAgICAnYW50LWRlc2lnbi12dWUvZXMvbG9jYWxlL2VuX1VTJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYmFzaWMtYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICAgIHdzOiB0cnVlLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UobmV3IFJlZ0V4cChgXi9iYXNpYy1hcGlgKSwgJycpLFxuICAgICAgICAgIC8vIG9ubHkgaHR0cHNcbiAgICAgICAgICAvLyBzZWN1cmU6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgICcvdXBsb2FkJzoge1xuICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzMwMC91cGxvYWQnLFxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoYF4vdXBsb2FkYCksICcnKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBvcGVuOiB0cnVlLCAvLyBcdTk4NzlcdTc2RUVcdTU0MkZcdTUyQThcdTU0MEVcdUZGMENcdTgxRUFcdTUyQThcdTYyNTNcdTVGMDBcbiAgICAgIHdhcm11cDoge1xuICAgICAgICBjbGllbnRGaWxlczogWycuL2luZGV4Lmh0bWwnLCAnLi9zcmMve3ZpZXdzLGNvbXBvbmVudHN9LyonXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICBJbnNwZWN0b3Ioe1xuICAgICAgICBvcGVuSW5FZGl0b3JIb3N0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTczJyxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFEsU0FBUywrQkFBK0I7QUFDcFQsT0FBTyxlQUFlO0FBRXRCLElBQU8sc0JBQVEsd0JBQXdCO0FBQUEsRUFDckMsV0FBVztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1osU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMLGNBQWM7QUFBQSxVQUNaLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLElBQUk7QUFBQSxVQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sYUFBYSxHQUFHLEVBQUU7QUFBQTtBQUFBO0FBQUEsUUFHL0Q7QUFBQSxRQUNBLFdBQVc7QUFBQSxVQUNULFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxVQUNkLElBQUk7QUFBQSxVQUNKLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLE9BQU8sVUFBVSxHQUFHLEVBQUU7QUFBQSxRQUM1RDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE1BQU07QUFBQTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sYUFBYSxDQUFDLGdCQUFnQiw0QkFBNEI7QUFBQSxNQUM1RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFVBQVU7QUFBQSxRQUNSLGtCQUFrQjtBQUFBLE1BQ3BCLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
