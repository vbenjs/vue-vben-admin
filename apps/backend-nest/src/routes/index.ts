import { Module, type Type } from '@nestjs/common';

const controller_glob_result = import.meta.glob<Type>('./*.controller.ts', {
  import: 'default',
  eager: true,
});
const controllers = Object.values(controller_glob_result);

@Module({ controllers })
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class RoutesModule {}
