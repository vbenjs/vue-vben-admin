<template>
  <textarea ref="TextareaRef" class="textarea" v-model="state.text"></textarea>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, watch } from 'vue';
  export default defineComponent({
    props: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
    },
    emits: ['update-text-list'],
    setup(props, { emit }) {
      const TextareaRef = ref<HTMLElement>();
      const state = ref({
        x: props.x,
        y: props.y,
        size: props.size,
        text: '',
      });
      onMounted(() => {
        setTimeout(() => {
          TextareaRef.value?.focus();
        }, 500);
      });
      watch(
        state,
        (n) => {
          emit('update-text-list', n);
        },
        {
          deep: true,
        }
      );
      return {
        state,
        TextareaRef,
      };
    },
  });
</script>
<style scoped>
  .textarea {
    top: v-bind(y + 'px');
    left: v-bind(x + 'px');
    position: absolute;
    padding: 1px;
    margin: 0;
    border: 1px dashed;
    border-radius: 0;
    outline: none;
    resize: none;
    overflow: hidden;
    width: 250px;
    height: 70px;
    font-size: v-bind(size + 'px');
    background-color: #0000000f;
  }
</style>
