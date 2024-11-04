import type { ClassProvider, Type } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';

const glob_result = import.meta.glob<Type>('./*.guard.ts', {
  import: 'default',
  eager: true,
});

export default Object.values(glob_result).map<ClassProvider>((useClass) => ({
  provide: APP_GUARD,
  useClass,
}));

export { Public } from './auth.guard';
