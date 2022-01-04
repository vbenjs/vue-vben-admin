// #!/usr/bin/env node

import { runBuildConfig } from './build-config'
import { cyan, red } from 'chalk'
import { PKG_NAME } from '../config'

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)

    // Generate configuration file
    if (!argvList.includes('disabled-config')) {
      runBuildConfig()
    }

    console.log(`✨ ${cyan(`[${PKG_NAME}]`)}` + ' - build successfully!')
  } catch (error) {
    console.log(red('vite build error:\n' + error))
    process.exit(1)
  }
}
runBuild()
