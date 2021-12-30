export const warn = (message: string) => {
  console.warn(`[admin warn]:${message}`)
}

export const error = (message: string): never => {
  throw new Error(`[admin error]:${message}`)
}
