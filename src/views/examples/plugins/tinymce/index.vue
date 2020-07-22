<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { Tinymce } from '@/components/tinymce/index';
  import { Button } from 'ant-design-vue';

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
      return () => (
        <div class="m-4">
          <div class="mb-4">
            <Button onClick={handleSetContent}>设置值</Button>
            <p class="mt-4"> {unref(tinymceContent)}</p>
          </div>
          <Tinymce value={unref(tinymceValue)} onChange={handleChange} />
        </div>
      );
    },
  });
</script>
