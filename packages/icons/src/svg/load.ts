import {
  addIcon,
  // addCollection
} from '@vben-core/icons';

let loaded = false;
if (!loaded) {
  loadSvgIcons();
  loaded = true;
}

// addCollection({
//   prefix: 'mdi',
//   icons: {
//       'account-box': {
//           body: '<path d="M6 17c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6m9-9a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3a3 3 0 0 1 3 3M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" fill="currentColor"/>',
//       },
//       'account-cash': {
//           body: '<path d="M11 8c0 2.21-1.79 4-4 4s-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4m0 6.72V20H0v-2c0-2.21 3.13-4 7-4c1.5 0 2.87.27 4 .72M24 20H13V3h11v17m-8-8.5a2.5 2.5 0 0 1 5 0a2.5 2.5 0 0 1-5 0M22 7a2 2 0 0 1-2-2h-3c0 1.11-.89 2-2 2v9a2 2 0 0 1 2 2h3c0-1.1.9-2 2-2V7z" fill="currentColor"/>',
//       },
//       'account': {
//           body: '<path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" fill="currentColor"/>',
//       },
//       'home': {
//           body: '<path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z" fill="currentColor"/>',
//       },
//   },
//   width: 24,
//   height: 24,
// });

/**
 * 自定义的svg图片转化为组件
 * @example ./svg/avatar.svg
 * <Icon icon="svg:avatar"></Icon>
 */

async function loadSvgIcons() {
  const svgEagers = import.meta.glob('./icons/**', {
    eager: true,
    query: '?raw',
  });

  await Promise.all(
    Object.entries(svgEagers).map((svg) => {
      const [key, body] = svg as [string, { default: string } | string];

      // ./icons/xxxx.svg => xxxxxx
      const start = key.lastIndexOf('/') + 1;
      const end = key.lastIndexOf('.');
      const iconName = key.slice(start, end);

      return addIcon(`svg:${iconName}`, {
        body: typeof body === 'object' ? body.default : body,
      });
    }),
  );
}
