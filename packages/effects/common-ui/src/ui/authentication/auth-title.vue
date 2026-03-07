<template>
  <div class="mb-7 sm:mx-auto sm:w-full sm:max-w-md">
    <h2
      class="mb-3 text-3xl/9 font-bold tracking-tight text-foreground lg:text-4xl"
    >
      <slot></slot>
    </h2>

    <p class="lg:text-md text-sm text-muted-foreground">
      <slot name="desc"></slot>
    </p>
  </div>
</template>
