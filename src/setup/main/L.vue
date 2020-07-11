<script lang="tsx">
  import { defineComponent } from '@/setup/vue';

  export default defineComponent({
    setup() {
      return () => {
        return (
          <figure>
            <div />
            <div />
            <div />
          </figure>
        );
      };
    },
  });
</script>
<style scoped lang="less">
  @X: 70deg;
  @color: #1ec0f5;
  @speed: 1s;

  figure {
    position: relative;
    top: 300px;
    left: 50%;
    z-index: 1;
    width: 64px;
    height: 64px;
    margin: 0;
    // background: linear-gradient(#232f44, #000);
    // transform: translate(-50%, -65%);
  }

  div {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  div::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-top: 12px solid @color;
    border-right: 5px solid @color;
    border-bottom: 10px solid transparent;
    border-left: 0 solid transparent;
    border-radius: 50%;
    content: '';
  }

  div:nth-child(1)::after {
    transform: rotateX(@X) rotateY(0deg) rotate(0deg);
    animation: ring @speed linear infinite;
  }

  div:nth-child(2)::after {
    transform: rotateX(@X) rotateY(60deg) rotate(0deg);
    animation: ring2 @speed linear infinite;
    animation-delay: (@speed / -2);
  }

  div:nth-child(3)::after {
    transform: rotateX(@X) rotateY(-60deg) rotate(0deg);
    animation: ring3 @speed linear infinite;
    animation-delay: (@speed / -3);
  }

  @keyframes ring {
    100% {
      transform: rotateX(@X) rotateY(0deg) rotate(360deg);
    }
  }
  @keyframes ring2 {
    100% {
      transform: rotateX(@X) rotateY(60deg) rotate(360deg);
    }
  }
  @keyframes ring3 {
    100% {
      transform: rotateX(@X) rotateY(-60deg) rotate(360deg);
    }
  }
</style>
