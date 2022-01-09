/**
 * Generate additional configuration files when used for packaging. The file can be configured with some global variables, so that it can be changed directly externally without repackaging
 */
import { writeFileSync, mkdirp, readFileSync } from 'fs-extra'
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR, PKG_NAME } from '../config'
import { getAppConfigFileName } from '@admin/utils'
import { cyan, red, gray, green } from 'chalk'
import { resolve } from 'path'
import dotenv from 'dotenv'

interface CreateConfigOptions {
  configName: string
  config: any
  configFileName?: string
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configFileName = getAppConfigFileName(config)
  createConfig({
    config,
    configName: configFileName,
    configFileName: GLOB_CONFIG_FILE_NAME,
  })
}

function createConfig(params: CreateConfigOptions) {
  const { configName, config, configFileName } = params
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')
    mkdirp(resolve(process.cwd(), OUTPUT_DIR))
    writeFileSync(
      resolve(process.cwd(), `${OUTPUT_DIR}/${configFileName}`),
      configStr,
    )

    console.log(
      cyan(`✨ [${PKG_NAME}]`) + ` - configuration file is build successfully:`,
    )
    console.log(gray(OUTPUT_DIR + '/' + green(configFileName)) + '\n')
  } catch (error) {
    console.log(
      red('configuration file configuration file failed to package:\n' + error),
    )
  }
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script
  const reg = new RegExp('--mode ([a-z_\\d]+)')
  const result = reg.exec(script as string) as any
  if (result) {
    const mode = result[1] as string
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
function getEnvConfig(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
  let envConfig: Record<string, string> = {}

  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(readFileSync(resolve(process.cwd(), item)))
      envConfig = { ...envConfig, ...env }
    } catch (e) {
      console.error(`Error in parsing ${item}`, e)
    }
  })

  const reg = new RegExp(`^(${match})`)

  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })

  return envConfig
}
