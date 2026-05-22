<template>
  <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
    <h2
      class="text-foreground mb-3 text-3xl/9 font-bold tracking-tight lg:text-4xl"
    >
      <slot></slot>
    </h2>

    <p class="lg:text-md text-muted-foreground text-sm">
      <slot name="desc"></slot>
    </p>
  </div>
</template>
