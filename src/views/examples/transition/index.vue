<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { Button } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/container/index';
  import {
    ExpandTransition,
    ExpandXTransition,
    FadeTransition,
    ScaleTransition,
    ScaleRotateTransition,
    SlideXTransition,
    SlideXReverseTransition,
    SlideYReverseTransition,
    SlideYTransition,
    ScrollYTransition,
    ScrollYReverseTransition,
    ScrollXTransition,
    ScrollXReverseTransition,
  } from '@/components/transition/index';
  export default defineComponent({
    name: 'TransitionDemo',
    setup() {
      const flag1 = ref(true);
      const flag2 = ref(true);
      const flag3 = ref(true);
      const flag4 = ref(true);
      const flag5 = ref(true);
      const flag6 = ref(true);
      const flag7 = ref(true);
      const flag8 = ref(true);
      const flag9 = ref(true);
      const flag10 = ref(true);
      const flag11 = ref(true);
      const flag12 = ref(true);
      const flag13 = ref(true);
      return () => (
        <div class="transition-demo p-4">
          <CollapseContainer title="Expand" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag1.value = !unref(flag1))}>
              点击
            </Button>
            <ExpandTransition>
              <div class="box" v-show={unref(flag1)} />
            </ExpandTransition>
          </CollapseContainer>
          <CollapseContainer title="Expand-X" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag2.value = !unref(flag2))}>
              点击
            </Button>
            <ExpandXTransition>
              <div class="box" v-show={unref(flag2)} />
            </ExpandXTransition>
          </CollapseContainer>

          <CollapseContainer title="Fade" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag3.value = !unref(flag3))}>
              点击
            </Button>
            <FadeTransition>
              <div class="box" v-show={unref(flag3)} />
            </FadeTransition>
          </CollapseContainer>
          <CollapseContainer title="Scale" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag4.value = !unref(flag4))}>
              点击
            </Button>
            <ScaleTransition>
              <div class="box" v-show={unref(flag4)} />
            </ScaleTransition>
          </CollapseContainer>
          <CollapseContainer title="ScaleRotate" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag5.value = !unref(flag5))}>
              点击
            </Button>
            <ScaleRotateTransition>
              <div class="box" v-show={unref(flag5)} />
            </ScaleRotateTransition>
          </CollapseContainer>

          <CollapseContainer title="SlideX" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag6.value = !unref(flag6))}>
              点击
            </Button>
            <SlideXTransition>
              <div class="box" v-show={unref(flag6)} />
            </SlideXTransition>
          </CollapseContainer>
          <CollapseContainer
            title="SlideXReverse"
            canExpan={false}
            class="transition-demo-wrap mr-4"
          >
            <Button type="primary" class="mb-3" onClick={() => (flag7.value = !unref(flag7))}>
              点击
            </Button>
            <SlideXReverseTransition>
              <div class="box" v-show={unref(flag7)} />
            </SlideXReverseTransition>
          </CollapseContainer>
          <CollapseContainer title="SlideY" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag8.value = !unref(flag8))}>
              点击
            </Button>
            <SlideYTransition>
              <div class="box" v-show={unref(flag8)} />
            </SlideYTransition>
          </CollapseContainer>
          <CollapseContainer
            title="SlideYReverse"
            canExpan={false}
            class="transition-demo-wrap mr-4"
          >
            <Button type="primary" class="mb-3" onClick={() => (flag9.value = !unref(flag9))}>
              点击
            </Button>
            <SlideYReverseTransition>
              <div class="box" v-show={unref(flag9)} />
            </SlideYReverseTransition>
          </CollapseContainer>

          <CollapseContainer title="ScrollX" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag10.value = !unref(flag10))}>
              点击
            </Button>
            <ScrollXTransition>
              <div class="box" v-show={unref(flag10)} />
            </ScrollXTransition>
          </CollapseContainer>
          <CollapseContainer
            title="ScrollXReverse"
            canExpan={false}
            class="transition-demo-wrap mr-4"
          >
            <Button type="primary" class="mb-3" onClick={() => (flag11.value = !unref(flag11))}>
              点击
            </Button>
            <ScrollXReverseTransition>
              <div class="box" v-show={unref(flag11)} />
            </ScrollXReverseTransition>
          </CollapseContainer>
          <CollapseContainer title="ScrollY" canExpan={false} class="transition-demo-wrap mr-4">
            <Button type="primary" class="mb-3" onClick={() => (flag12.value = !unref(flag12))}>
              点击
            </Button>
            <ScrollYTransition>
              <div class="box" v-show={unref(flag12)} />
            </ScrollYTransition>
          </CollapseContainer>
          <CollapseContainer
            title="ScrollYReverse"
            canExpan={false}
            class="transition-demo-wrap mr-4"
          >
            <Button type="primary" class="mb-3" onClick={() => (flag13.value = !unref(flag13))}>
              点击
            </Button>
            <ScrollYReverseTransition>
              <div class="box" v-show={unref(flag13)} />
            </ScrollYReverseTransition>
          </CollapseContainer>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  .transition-demo {
    display: flex;
    flex-wrap: wrap;

    &-wrap {
      width: calc(50% - 20px);
      height: 400px;
      padding: 14px;
      margin-top: 20px;
    }

    .box {
      width: 300px;
      height: 300px;
      background: @primary-color;
      border-radius: 50%;
    }
  }
</style>
