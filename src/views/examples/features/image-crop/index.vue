<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';

  // 第三方组件不符合项目规范，所以用require引入
  const Upload = require('vue-image-crop-upload').default;
  export default defineComponent({
    setup() {
      const showRef = ref(false);
      const resultUrlRef = ref('');
      return () => (
        <div class="p-4">
          <a-button type="primary" onClick={() => (showRef.value = !unref(showRef))}>
            设置头像
          </a-button>
          <img class="m-4" src={unref(resultUrlRef)} width={300} />
          <Upload
            field="avatar1"
            ki="0"
            width={300}
            height={300}
            img-format="jpg"
            img-bgc="#fff"
            url="https://httpbin.org/post"
            value={unref(showRef)}
            headers={{ smail: '*_~' }}
            params={{
              token: '123456798',
              name: 'img',
            }}
            onInput={(v: boolean) => (showRef.value = v)}
            on={{
              'crop-success': (imgDataUrl: string) => {
                resultUrlRef.value = imgDataUrl;
              },
            }}
          />
        </div>
      );
    },
  });
</script>
