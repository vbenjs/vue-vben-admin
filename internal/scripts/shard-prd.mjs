#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const SRC = 'docs/prd.md';
const DEST_DIR = 'docs/prd/epics';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function findEpicSections(md) {
  const lines = md.split('\n');
  const sections = [];
  const startDetailIdx = lines.findIndex((l) => l.trim() === '## Epic 详细设计');
  if (startDetailIdx === -1) throw new Error('未找到 “## Epic 详细设计” 段落');

  const endIdx = (() => {
    const i = lines.findIndex((l) => l.trim() === '## Checklist Results Report');
    return i === -1 ? lines.length : i;
  })();

  for (let i = startDetailIdx + 1; i < endIdx; i++) {
    const line = lines[i];
    if (line && line.startsWith('### Epic ')) {
      const m = line.match(/^###\s+Epic\s+(\d+):\s*(.*)$/);
      if (!m) continue;
      const num = parseInt(m[1], 10);
      const title = m[2];
      sections.push({ num, title, start: i });
    }
  }

  // determine end for each
  for (let s = 0; s < sections.length; s++) {
    const start = sections[s].start;
    const nextStart = s + 1 < sections.length ? sections[s + 1].start : endIdx;
    sections[s].end = nextStart; // exclusive
  }

  return { lines, sections };
}

async function writeShard(lines, sec) {
  const shardPath = `${DEST_DIR}/epic-${pad2(sec.num)}.md`;
  const slice = lines.slice(sec.start, sec.end);
  const first = slice[0].replace(/^###\s+/, '# ');
  const rest = slice.slice(1).join('\n');
  const originLine = sec.start + 1; // 1-based
  const content = `${first}\n\n权威来源：../../prd.md#L${originLine}\n\n${rest}\n`;
  await mkdir(dirname(shardPath), { recursive: true });
  await writeFile(shardPath, content, 'utf8');
  return shardPath;
}

async function main() {
  const md = await readFile(SRC, 'utf8');
  const { lines, sections } = findEpicSections(md);
  const written = [];
  for (const sec of sections) {
    const p = await writeShard(lines, sec);
    written.push(p);
  }
  console.log(`Shard updated: ${written.length} files`);
  for (const p of written) console.log(` - ${p}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

