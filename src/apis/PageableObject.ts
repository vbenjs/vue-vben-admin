import Sort from './Sort';
/**
 *
 * @export
 * @interface PageableObject
 */
export default interface PageableObject {
  /**
   *
   * @type {number}
   * @memberof PageableObject
   */
  offset?: number;
  /**
   *
   * @type {Sort}
   * @memberof PageableObject
   */
  sort?: Sort;
  /**
   *
   * @type {number}
   * @memberof PageableObject
   */
  pageSize?: number;
  /**
   *
   * @type {number}
   * @memberof PageableObject
   */
  pageNumber?: number;
  /**
   *
   * @type {boolean}
   * @memberof PageableObject
   */
  paged?: boolean;
  /**
   *
   * @type {boolean}
   * @memberof PageableObject
   */
  unpaged?: boolean;
}
