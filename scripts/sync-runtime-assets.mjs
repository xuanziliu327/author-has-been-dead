import { access, copyFile, mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const sourceDir = path.join(root, '第一章')
const outputDir = path.join(root, 'public', 'runtime-assets')

const requiredFiles = [
  'river.mp3',
  'button.mp3',
  'gasp.mp3',
  '刘直线_法医学尸体检验鉴定书_v7.pdf',
  '死者房间布局图.png',
]

const optionalFiles = {
  story: 'story.mp3',
  endingYes: 'ending_yes.mp4',
  endingNo: 'ending_no.mp4',
}

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

await rm(outputDir, { recursive: true, force: true })
await mkdir(outputDir, { recursive: true })

for (const fileName of requiredFiles) {
  const source = path.join(sourceDir, fileName)
  if (!(await exists(source))) {
    throw new Error(`缺少必需运行资源：第一章/${fileName}`)
  }
  await copyFile(source, path.join(outputDir, fileName))
}

const manifest = {
  story: false,
  endingYes: false,
  endingNo: false,
  buildVersion: `${Date.now()}`,
}

for (const [key, fileName] of Object.entries(optionalFiles)) {
  const source = path.join(sourceDir, fileName)
  if (await exists(source)) {
    await copyFile(source, path.join(outputDir, fileName))
    manifest[key] = true
  }
}

await writeFile(
  path.join(outputDir, 'media-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
  'utf8',
)

console.log(
  `运行资源已同步：story=${manifest.story}, endingYes=${manifest.endingYes}, endingNo=${manifest.endingNo}`,
)
