var d=Object.defineProperty;var _=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,b=Object.prototype.propertyIsEnumerable;var c=(r,a,t)=>a in r?d(r,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[a]=t,f=(r,a)=>{for(var t in a||(a={}))y.call(a,t)&&c(r,t,a[t]);if(_)for(var t of _(a))b.call(a,t)&&c(r,t,a[t]);return r};var s=(r,a,t)=>new Promise((i,u)=>{var l=o=>{try{e(t.next(o))}catch(n){u(n)}},m=o=>{try{e(t.throw(o))}catch(n){u(n)}},e=o=>o.done?i(o.value):Promise.resolve(o.value).then(l,m);e((t=t.apply(r,a)).next())});import{_ as p}from"./entry/index-DN3d1Q0w-1711520613238.js";import{y as S,u as O}from"./vue-COhTiP8A.js";function E(r,a){function t(){S(()=>s(this,null,function*(){if(r=O(r),!r)return;(yield p(()=>import("./sortable.esm-CoO8jRpa.js"),__vite__mapDeps([]))).default.create(r,f({animation:100,delay:400,delayOnTouchOnly:!0},a))}))}return{initSortable:t}}export{E as u};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
