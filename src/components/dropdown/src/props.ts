import { PropOptions } from 'compatible-vue';
/**
 * @description: 基础表格参数配置
 */
export const dropdownProps = {
  /**
   * the trigger mode which executes the drop-down action
   * @default ['hover']
   * @type string[]
   */
  trigger: {
    type: [Array],
    default: () => {
      return ['contextmenu'];
    },
  } as PropOptions<string[]>,

  // /**
  //  * the dropdown menu
  //  * @type () => Menu
  //  */
  // overlay: {
  //   type: null,
  // },

  // /**
  //  * Class name of the dropdown root element
  //  * @type string
  //  */
  // overlayClassName: String,

  // /**
  //  * Style of the dropdown root element
  //  * @type object
  //  */
  // overlayStyle: Object,

  // /**
  //  * whether the dropdown menu is visible
  //  * @type boolean
  //  */
  // visible: Boolean,

  // /**
  //  * whether the dropdown menu is disabled
  //  * @type boolean
  //  */
  // disabled: Boolean,

  // /**
  //  * to set the ontainer of the dropdown menu. The default is to create a div element in body, you can reset it to the scrolling area and make a relative reposition.
  //  * @default () => document.body
  //  * @type Function
  //  */
  // getPopupContainer: Function,

  // /**
  //  * placement of pop menu: bottomLeft bottomCenter bottomRight topLeft topCenter topRight
  //  * @default 'bottomLeft'
  //  * @type string
  //  */
  // placement: String,
};
export const basicDropdownProps = Object.assign({}, dropdownProps, {
  dropMenuList: {
    type: Array,
    default: () => [],
  } as PropOptions<any[]>,
});
