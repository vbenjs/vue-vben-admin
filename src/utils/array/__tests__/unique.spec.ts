import { unique } from '../unique';
describe('unique', () => {
  it('数组去重', () => {
    const result = [
      {
        a: 1,
      },
      {
        a: 2,
      },
      {
        a: 3,
      },
    ];
    const arr: any[] = [
      ...result,
      {
        a: 1,
      },
    ];
    expect(unique(arr, 'a')).toEqual(result);
  });

  it('数组去重,null情况', () => {
    const result = [
      {
        a: null,
      },
      {
        a: 2,
      },
      {
        a: 3,
      },
    ];
    const arr: any[] = [
      ...result,
      {
        a: null,
      },
    ];
    expect(unique(arr, 'a')).toEqual(result);
  });
});
