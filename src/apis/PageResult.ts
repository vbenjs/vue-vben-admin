import PageableObject from './PageableObject';
import Sort from './Sort';
/**
 *
 * @export
 * @interface PageResult
 */
export default interface PageResult<T> {
  /**
   *
   * @type {number}
   * @memberof PageResult
   */
  totalElements: number;
  /**
   *
   * @type {number}
   * @memberof PageResult
   */
  totalPages: number;
  /**
   *
   * @type {number}
   * @memberof PageResult
   */
  size: number;
  /**
   *
   * @type {Array<T>}
   * @memberof PageResult
   */
  content?: Array<T>;
  /**
   *
   * @type {number}
   * @memberof PageResult
   */
  number: number;
  /**
   *
   * @type {Sort}
   * @memberof PageResult
   */
  sort: Sort;
  /**
   *
   * @type {boolean}
   * @memberof PageResult
   */
  first: boolean;
  /**
   *
   * @type {boolean}
   * @memberof PageResult
   */
  last: boolean;
  /**
   *
   * @type {number}
   * @memberof PageResult
   */
  numberOfElements: number;
  /**
   *
   * @type {PageableObject}
   * @memberof PageResult
   */
  pageable: PageableObject;
  /**
   *
   * @type {boolean}
   * @memberof PageResult
   */
  empty: boolean;
}
