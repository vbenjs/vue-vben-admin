import { RoleEnum } from '@pkg/tokens'

export interface ContextOptions {
  hasPermission: (
    value?: string | RoleEnum[] | string[] | undefined,
    def?: boolean,
  ) => boolean
  createLoading: AnyFunction<any>
}

export let context: ContextOptions = {
  hasPermission: () => false,
  createLoading: () => {},
}

export const initDirective = async (_context: ContextOptions) => {
  context = _context
}
