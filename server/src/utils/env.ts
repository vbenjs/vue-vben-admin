import dotenv from 'dotenv'

export const ENV = process.env.NODE_ENV

export const isDev = ENV === 'development'

export const isProd = ENV === 'production'

/**
 * 从env加载配置
 */
export function loadEnv() {
  const env = process.env.NODE_ENV
  const envList = [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env']
  envList.forEach((e) => {
    dotenv.config({
      path: e,
    })
  })

  for (const envName of Object.keys(process.env)) {
    const value = process?.env?.[envName]?.replace(/\\n/g, '\n') ?? ''
    process.env[envName] = value
  }
}

export function isProductionFn(): boolean {
  return getEnvFn() === 'production'
}

export function getEnvFn() {
  return process.env.NODE_ENV
}
