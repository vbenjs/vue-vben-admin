import { name, version } from '../package.json'

// The name of the configuration file entered in the production environment
export const GLOB_CONFIG_FILE_NAME = '_app.config.js'

// vite package output directory
export const OUTPUT_DIR = 'dist'

// project name
export const PKG_NAME = name

// project version
export const PKG_VERSION = version

// Read all environment variable configuration files to process.env
export const wrapperEnv = (envConf: Recordable): ViteEnv => {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName =
      realName === 'true' ? true : realName === 'false' ? false : realName

    if (envName === 'VITE_PORT') {
      realName = Number(realName)
    }

    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'))
      } catch (error) {
        realName = ''
      }
    }
    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }
  return ret
}
