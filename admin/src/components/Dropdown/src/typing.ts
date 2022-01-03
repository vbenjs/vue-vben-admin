export interface DropMenu {
  onClick?: AnyFunction<any>
  to?: string
  icon?: string
  event: string | number
  text: string
  disabled?: boolean
  divider?: boolean
}
