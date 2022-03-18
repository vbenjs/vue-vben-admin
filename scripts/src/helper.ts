import { execa } from 'execa'
import prompts from 'prompts'

type WorkspacePackage = { name: string; version?: string; path: string }

async function getPackages() {
  const { stdout } = await execa('pnpm', [
    'ls',
    '-r',
    '--depth',
    '-1',
    '--json',
  ])

  return (JSON.parse(stdout) as WorkspacePackage[]).filter(
    (p) =>
      p.name !== 'vben-admin-monorepo' &&
      p.name !== 'scripts' &&
      p.name.startsWith('@apps') &&
      p.name !== '@apps/api-server',
  )
}

async function runScript(pkg: WorkspacePackage, script: string) {
  execa('pnpm', ['run', script, '--filter', `${pkg.name}...`, '--parallel'], {
    stdio: 'inherit',
    preferLocal: true,
  })
}

async function runSingleScript(pkg: WorkspacePackage, script: string) {
  execa('pnpm', ['run', script, '--filter', `${pkg.name}`], {
    stdio: 'inherit',
    preferLocal: true,
  })
}

export async function run(command: string) {
  const main = async () => {
    const packages = await getPackages()
    if (!packages.length) {
      return
    }

    if (packages.length === 1) {
      runSingleScript(packages[0], command)
      return
    }

    const { name } = await prompts([
      {
        name: 'name',
        message: `Choose the package to run ${command} script`,
        type: 'select',
        choices: packages.map((p) => {
          return {
            title: p.name,
            value: p.name,
          }
        }),
      },
    ])

    runScript(
      packages.find((p) => p.name === name),
      command,
    )
  }

  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
