<template>
  <div :class="prefixCls" @click.stop>
    <ClickOutSide @clickOutside="handleClose">
      <div :class="`${prefixCls}-content`">
        <a-input
          :class="`${prefixCls}-input`"
          :placeholder="t('component.app.search')"
          allow-clear
          @change="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <div :class="`${prefixCls}-not-data`" v-show="getIsNotData">
          {{ t('component.app.searchNotData') }}
        </div>
        <ul :class="`${prefixCls}-list`" v-show="!getIsNotData" ref="scrollWrap">
          <li
            :ref="setRefs(index)"
            v-for="(item, index) in searchResult"
            :key="item.path"
            :data-index="index"
            @mouseenter="handleMouseenter"
            @click="handleEnter"
            :class="[
              `${prefixCls}-list__item`,
              {
                [`${prefixCls}-list__item--active`]: activeIndex === index,
              },
            ]"
          >
            <div :class="`${prefixCls}-list__item-icon`">
              <g-icon :icon="item.icon || 'mdi:form-select'" :size="20" />
            </div>
            <div :class="`${prefixCls}-list__item-text`">{{ item.name }}</div>
            <div :class="`${prefixCls}-list__item-enter`">
              <g-icon icon="ant-design:enter-outlined" :size="20" />
            </div>
          </li>
        </ul>
        <AppSearchFooter />
      </div>
    </ClickOutSide>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, unref, ref } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRefs } from '/@/hooks/core/useRefs';
  import { useMenuSearch } from './useMenuSearch';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import AppSearchFooter from './AppSearchFooter.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ClickOutSide } from '/@/components/ClickOutSide';
  export default defineComponent({
    name: 'AppSearchModal',
    components: { SearchOutlined, ClickOutSide, AppSearchFooter },
    emits: ['close'],
    setup(_, { emit }) {
      const scrollWrap = ref<ElRef>(null);
      const { prefixCls } = useDesign('app-search-modal');
      const { t } = useI18n();
      const [refs, setRefs] = useRefs();

      const {
        handleSearch,
        searchResult,
        keyword,
        activeIndex,
        handleEnter,
        handleMouseenter,
      } = useMenuSearch(refs, scrollWrap, emit);

      const getIsNotData = computed(() => {
        return !keyword || unref(searchResult).length === 0;
      });

      return {
        t,
        prefixCls,
        handleSearch,
        searchResult,
        activeIndex,
        getIsNotData,
        handleEnter,
        setRefs,
        scrollWrap,
        handleMouseenter,
        handleClose: () => {
          emit('close');
        },
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../../design/index.less';
  @prefix-cls: ~'@{namespace}-app-search-modal';

  .@{prefix-cls} {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    width: 100%;
    height: 100%;
    padding-top: 50px;
    // background: #656c85cc;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    // backdrop-filter: blur(2px);

    &-content {
      position: relative;
      width: 532px;
      // padding: 14px;
      margin: 0 auto auto auto;
      background: #f5f6f7;
      border-radius: 6px;
      box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.5), 0 3px 8px 0 #555a64;
      flex-direction: column;
    }

    &-input {
      width: calc(100% - 28px);
      height: 56px;
      margin: 14px 14px 0 14px;
      font-size: 1.5em;
      color: #1c1e21;

      span[role='img'] {
        color: #999;
      }
    }

    &-not-data {
      display: flex;
      width: 100%;
      height: 100px;
      font-size: 0.9;
      color: rgb(150 159 175);
      align-items: center;
      justify-content: center;
    }

    &-list {
      max-height: 472px;
      padding: 0 14px;
      padding-bottom: 20px;
      margin: 0 auto;
      margin-top: 14px;
      overflow: auto;

      &__item {
        position: relative;
        display: flex;
        width: 100%;
        height: 56px;
        padding-bottom: 4px;
        padding-left: 14px;
        margin-top: 8px;
        font-size: 14px;
        color: @text-color-base;
        cursor: pointer;
        // background: @primary-color;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 3px 0 #d4d9e1;
        align-items: center;

        &--active {
          color: #fff;
          background: @primary-color;

          .@{prefix-cls}-list__item-enter {
            opacity: 1;
          }
        }

        &-icon {
          width: 30px;
        }

        &-text {
          flex: 1;
        }

        &-enter {
          width: 30px;
          opacity: 0;
        }
      }
    }
  }
</style>
