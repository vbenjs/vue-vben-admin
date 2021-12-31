import { resolve, join } from 'path'
import { ensureDir, readJSON, writeFileSync, emptyDir } from 'fs-extra'
import { cyan } from 'chalk'
import { PKG_NAME } from '../config'
import inquirer from 'inquirer'

async function generateIcon() {
  const dir = resolve(process.cwd(), 'node_modules/@iconify/json')

  const raw = await readJSON(join(dir, 'collections.json'))

  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id,
  }))

  const choices = collections.map((item) => ({
    key: item.id,
    value: item.id,
    name: item.name,
  }))

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'useType',
        choices: [
          { key: 'local', value: 'local', name: 'Local' },
          { key: 'onLine', value: 'onLine', name: 'OnLine' },
        ],
        message: 'How to use icons?',
      },
      {
        type: 'list',
        name: 'iconSet',
        choices: choices,
        message: 'Select the icon set that needs to be generated?',
      },
      {
        type: 'input',
        name: 'output',
        message: 'Select the icon set that needs to be generated?',
        default: 'src/components/Icon/data',
      },
    ])
    .then(async (answers) => {
      const { iconSet, output, useType } = answers
      const outputDir = resolve(process.cwd(), output)
      ensureDir(outputDir)
      const genCollections = collections.filter((item) =>
        [iconSet].includes(item.id),
      )
      const prefixSet: string[] = []
      for (const info of genCollections) {
        const data = await readJSON(join(dir, 'json', `${info.id}.json`))
        if (data) {
          const { prefix } = data
          const isLocal = useType === 'local'
          const icons = Object.keys(data.icons).map(
            (item) => `${isLocal ? prefix + ':' : ''}${item}`,
          )

          await writeFileSync(
            join(output, `icons.data.ts`),
            `export default ${
              isLocal
                ? JSON.stringify(icons)
                : JSON.stringify({ prefix, icons })
            }`,
          )
          prefixSet.push(prefix)
        }
      }
      emptyDir(join(process.cwd(), 'node_modules/.vite'))
      console.log(
        `✨ ${cyan(`[${PKG_NAME}]`)}` +
          ' - Icon generated successfully:' +
          `[${prefixSet}]`,
      )
    })
}

generateIcon()
