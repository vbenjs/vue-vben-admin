<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { Tinymce } from '@/components/tinymce/index';
  import { Button, Switch } from 'ant-design-vue';

  export default defineComponent({
    name: 'TinymceDemo',
    setup() {
      const tinymceValue = ref('init value');
      const tinymceContent = ref('content value');

      function handleChange(value) {
        tinymceContent.value = value;
      }
      function handleSetContent() {
        tinymceValue.value = 'set content value' + Math.random();
      }

      const showUploadImageRef = ref(true);
      function handleChangeUpload(checked) {
        showUploadImageRef.value = checked;
      }
      return () => (
        <div class="m-4">
          <div class="mb-4">
            <div class="mb-4">
              <label class="mr-2">是否显示上传按钮:</label>
              <Switch
                checked-children="是"
                un-checked-children="否"
                default-checked
                onChange={handleChangeUpload}
              />
            </div>

            <Button onClick={handleSetContent}>设置值</Button>
            <p class="mt-4"> {unref(tinymceContent)}</p>
          </div>
          <Tinymce
            value={unref(tinymceValue)}
            onChange={handleChange}
            showUploadImage={unref(showUploadImageRef)}
            maxSize={1}
            maxNumber={3}
          />
        </div>
      );
    },
  });
</script>
