interface HeaderScrollStateOptions {
  arrivedTop: boolean;
  currentHidden: boolean;
  directionDown: boolean;
  directionUp: boolean;
  headerHeight: number;
  scrollTop: number;
}

export function resolveHeaderHiddenOnScroll({
  arrivedTop,
  currentHidden,
  directionDown,
  directionUp,
  headerHeight,
  scrollTop,
}: HeaderScrollStateOptions) {
  if (arrivedTop || scrollTop < headerHeight) {
    return false;
  }
  if (directionUp) {
    return false;
  }
  if (directionDown) {
    return true;
  }
  return currentHidden;
}
