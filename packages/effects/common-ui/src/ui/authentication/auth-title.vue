<template>
  <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
    <!-- 每个页面应有且仅有一个 h1 标签，用于 SEO 和可访问性 -->
    <h1
      class="text-foreground mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl"
    >
      <slot></slot>
    </h1>

    <p class="text-muted-foreground lg:text-md text-sm">
      <slot name="desc"></slot>
    </p>
  </div>
</template>
