const validColors = ['error', 'warning', 'success', ''] as const;
type ButtonColorType = typeof validColors[number];

export const buttonProps = {
  color: {
    type: String as PropType<ButtonColorType>,
    validator: (v) => validColors.includes(v),
    default: '',
  },
  loading: { type: Boolean },
  disabled: { type: Boolean },
  /**
   * Text before icon.
   */
  preIcon: { type: String },
  /**
   * Text after icon.
   */
  postIcon: { type: String },
  /**
   * preIcon and postIcon icon size.
   * @default: 14
   */
  iconSize: { type: Number, default: 14 },
  onClick: { type: Function as PropType<(...args) => any>, default: null },
};
