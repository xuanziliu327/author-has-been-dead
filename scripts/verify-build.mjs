import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const distDir = path.join(root, 'dist')
const forbiddenPlaintext = ['151617', '161718']
const backstageFiles = [
  path.join(root, '第一章', '玩家游玩流程.md'),
  path.join(root, '第一章', '第一章大纲和谜题设计.md'),
  path.join(root, '牧芙蓉到底是怎么想的.md'),
  path.join(root, '最后最后的谜底，关于他者的魔法.md'),
]
const forbiddenFileNames = backstageFiles.map((file) => path.basename(file))

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(fullPath) : [fullPath]
  }))
  return nested.flat()
}

function compact(value) {
  return value.replace(/\\n|\\r|\s/g, '')
}

const distFiles = await collectFiles(distDir)
const relativeNames = distFiles.map((file) => path.relative(distDir, file))
const readableExtensions = new Set(['.html', '.js', '.css', '.json', '.txt', '.md', '.map'])
const readable = distFiles.filter((file) => readableExtensions.has(path.extname(file).toLowerCase()))
const distText = (await Promise.all(readable.map((file) => readFile(file, 'utf8')))).join('\n')
const compactDistText = compact(distText)
const failures = []

for (const value of forbiddenPlaintext) {
  if (distText.includes(value)) failures.push(`production 中出现明文：${value}`)
}

for (const fileName of forbiddenFileNames) {
  if (relativeNames.some((name) => name.includes(fileName)) || distText.includes(fileName)) {
    failures.push(`production 中出现幕后文件：${fileName}`)
  }
}

for (const backstageFile of backstageFiles) {
  let source
  try {
    source = compact(await readFile(backstageFile, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') continue
    throw error
  }
  const fingerprints = [0.2, 0.5, 0.8]
    .map((ratio) => source.slice(Math.floor(source.length * ratio), Math.floor(source.length * ratio) + 96))
    .filter((part) => part.length >= 64)
  if (fingerprints.some((fingerprint) => compactDistText.includes(fingerprint))) {
    failures.push(`production 中出现幕后正文片段：${path.basename(backstageFile)}`)
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log('构建检查通过：未发现幕后资料或明文密码。')
}
