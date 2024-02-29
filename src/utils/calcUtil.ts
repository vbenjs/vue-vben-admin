export function toPrecent(num: number, fixed: number, isSign: true): string;
export function toPrecent(num: number, fixed?: number, isSign?: false): number;
export function toPrecent(num: number, fixed = 2, isSign = false) {
  if (!isSign) {
    return Number((num * 100).toFixed(fixed));
  } else {
    return Number((num * 100).toFixed(fixed)) + "%";
  }
}
