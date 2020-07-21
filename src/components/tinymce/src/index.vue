<script lang="tsx">
  import {
    defineComponent,
    onMounted,
    onUnmounted,
    computed,
    unref,
    reactive,
    watch,
    // onActivated,
  } from 'compatible-vue';
  import tinymce from 'tinymce';
  import 'tinymce/themes/silver/theme';

  import 'tinymce/plugins/advlist';
  import 'tinymce/plugins/anchor';
  import 'tinymce/plugins/autolink';
  import 'tinymce/plugins/autoresize';
  import 'tinymce/plugins/autosave';
  import 'tinymce/plugins/bbcode';
  import 'tinymce/plugins/charmap';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/codesample';
  import 'tinymce/plugins/colorpicker';
  import 'tinymce/plugins/contextmenu';
  import 'tinymce/plugins/directionality';
  import 'tinymce/plugins/emoticons';
  import 'tinymce/plugins/fullpage';
  import 'tinymce/plugins/fullscreen';
  import 'tinymce/plugins/help';
  import 'tinymce/plugins/hr';
  import 'tinymce/plugins/image';
  import 'tinymce/plugins/imagetools';
  import 'tinymce/plugins/importcss';
  import 'tinymce/plugins/insertdatetime';
  import 'tinymce/plugins/legacyoutput';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/media';
  import 'tinymce/plugins/nonbreaking';
  import 'tinymce/plugins/noneditable';
  import 'tinymce/plugins/pagebreak';
  import 'tinymce/plugins/paste';
  import 'tinymce/plugins/preview';
  import 'tinymce/plugins/print';
  import 'tinymce/plugins/quickbars';
  import 'tinymce/plugins/save';
  import 'tinymce/plugins/searchreplace';
  import 'tinymce/plugins/spellchecker';
  import 'tinymce/plugins/tabfocus';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/template';
  import 'tinymce/plugins/textcolor';
  import 'tinymce/plugins/textpattern';
  import 'tinymce/plugins/toc';
  import 'tinymce/plugins/visualblocks';
  import 'tinymce/plugins/visualchars';
  import 'tinymce/plugins/wordcount';

  import toolbar from './toolbar';
  import plugins from './plugins';

  import { basicProps } from './props';
  import { BasicProps } from './types';

  export default defineComponent({
    name: 'Tinymce',
    props: basicProps,
    setup(props: BasicProps, { emit, root }) {
      const tinymceState = reactive({
        hasChange: false,
        hasInit: false,
      });
      const getWidth = computed(() => {
        const width = props.width + '';
        if (/^[\d]+(\.[\d]+)?$/.test(width)) {
          return `${width}px`;
        }
        return width;
      });
      function getOptions() {
        const def = {
          selector: `#${props.id}`,
          height: props.height,
          toolbar: toolbar,
          plugins: plugins,
          // 最上方menu
          menubar: props.menubar,
          // 去水印
          branding: false,
          // 隐藏底栏的元素路径
          elementpath: false,
          // 拼写检查
          browser_spellcheck: true,
          // 隐藏编辑器底部的状态栏
          statusbar: false,
          // 允许粘贴图像
          paste_data_images: true,
          // skin: 'oxide',
          // 皮肤,必须
          skin_url: 'resource/tinymce/skins/ui/oxide',
          // 语言包
          language_url: 'resource/tinymce/langs/zh_CN.js',
          // 中文
          language: 'zh_CN',
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: 'square',
          advlist_number_styles: 'default',
          default_link_target: '_blank',
          link_title: false,
          nonbreaking_force_tab: true,
          end_container_on_empty_block: true,
          powerpaste_word_import: 'clean',
          // 初始化后执行
          init_instance_callback: function (editor) {
            if (props.value) {
              editor.setContent(props.value);
            }
            tinymceState.hasInit = true;
            editor.on('NodeChange Change KeyUp SetContent', () => {
              // tinymceState.hasChange = true;
              emit('change', editor.getContent());
            });
          },
        };
        return { ...def, ...props.options };
      }
      function initTinymce() {
        tinymce.init(getOptions());
      }
      function destroyTinymce() {
        const tinymceInstance = tinymce.get(props.id);
        // if (this.fullscreen) {
        //   tinymceInstance.execCommand('mceFullScreen');
        // }

        if (tinymceInstance) {
          tinymceInstance.destroy();
        }
      }
      watch(
        () => props.value,
        (value) => {
          // if (!tinymceState.hasChange && tinymceState.hasInit) {
          if (tinymceState.hasInit) {
            root.$nextTick(() => tinymce.get(props.id).setContent(value || ''));
          }
        }
      );
      onMounted(() => {
        initTinymce();
      });
      // onActivated(() => {
      //   if (window.tinymce) {
      //     initTinymce();
      //   }
      // });
      onUnmounted(() => {
        destroyTinymce();
      });
      return () => (
        <div class="tinymce-container" style={{ width: unref(getWidth) }}>
          <textarea id={props.id} class="tinymce-textarea" />
        </div>
      );
    },
  });
</script>
