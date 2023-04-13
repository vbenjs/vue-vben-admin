<script lang="ts" setup></script>

<template>
  <div> hello </div>
</template>

<style lang="scss" scoped>
  .btn {
    position: relative;
    z-index: 1;
    margin: 5px 0;
    padding: 8px 50px;
    overflow: hidden;
    transition: 0.2s ease;
    border-radius: 30px;
    background: transparent;
    font-size: 1em;
    font-weight: bold;
    letter-spacing: 2px;
    cursor: pointer;

    &.green {
      border: 4px solid var(--green);
      color: var(--blue);

      &::before {
        content: '';
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        width: 0%;
        height: 100%;
        transition: 0.2s ease;
        background: var(--green);
      }

      &:hover {
        transition: 0.2s ease;
        background: var(--green);
        color: var(--white);

        &::before {
          width: 100%;
        }
      }
    }
  }
</style>
