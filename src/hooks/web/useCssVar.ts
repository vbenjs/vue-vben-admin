// import { ref, Ref, isRef, watch } from '@vue/runtime-dom';

// TODO 打开注释会造成热更新失效,待排查
// export default function useCssVar(prop: string, refEl?: Ref<HTMLElement | null>) {
//   const refVar = ref('');
//   let el: HTMLElement = document.documentElement;

//   if (isRef(refEl)) {
//     watch(
//       refEl,
//       () => {
//         if (refEl.value) {
//           el = refEl.value as HTMLElement;
//           refVar.value = getComputedStyle(el).getPropertyValue(prop);
//         }
//       },
//       { immediate: true }
//     );
//   } else {
//     refVar.value = getComputedStyle(el).getPropertyValue(prop);
//   }

//   watch(
//     refVar,
//     (val) => {
//       el && el.style.setProperty(prop, val);
//     },
//     { immediate: true }
//   );

//   return refVar;
// }

export function getCssVar(prop: string, dom = document.documentElement) {
  return getComputedStyle(dom).getPropertyValue(prop);
}

export function setCssVar(prop: string, val: any, dom = document.documentElement) {
  dom.style.setProperty(prop, val);
}
