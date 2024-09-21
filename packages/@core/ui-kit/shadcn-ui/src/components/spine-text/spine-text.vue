<template>
  <div class="vben-spine-text !bg-clip-text text-transparent">
    <slot></slot>
  </div>
</template>
<style>
.vben-spine-text {
  background:
    radial-gradient(circle at center, rgb(255 255 255 / 80%), #f000) -200% 50% /
      200% 100% no-repeat,
    #000;
  animation: shine 3s linear infinite;
}

.dark .vben-spine-text {
  background:
    radial-gradient(circle at center, rgb(24 24 26 / 80%), transparent) -200% 50% /
      200% 100% no-repeat,
    #f4f4f4;
}

@keyframes shine {
  0% {
    background-position: 200% 0%;
  }

  100% {
    background-position: -200% 0%;
  }
}
</style>
