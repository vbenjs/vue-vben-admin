import { format, getFileInfo, resolveConfig } from 'prettier';
import { fs } from 'zx';

async function prettierFormat(filepath: string) {
  const prettierOptions = await resolveConfig(filepath, {});

  const fileInfo = await getFileInfo(filepath);

  const input = await fs.readFile(filepath, 'utf8');
  const output = await format(input, {
    ...prettierOptions,
    parser: fileInfo.inferredParser as any,
  });
  if (output !== input) {
    fs.writeFileSync(filepath, output, 'utf8');
  }
  return output;
}

export { prettierFormat };
