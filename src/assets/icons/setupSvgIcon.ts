/**
 * 引入svgicon图片
 */

export default (): void => {
  const requireAll = (requireContext) => {
    requireContext.keys().map(requireContext);
  };
  const req = require.context('./svg', true, /\.svg$/);
  requireAll(req);
};
