import type { Type } from '@nestjs/common';

const glob_result = import.meta.glob<Type>('./*.middleware.ts', {
  import: 'default',
  eager: true,
});

export default Object.values(glob_result);
