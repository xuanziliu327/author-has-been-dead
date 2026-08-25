import { createHash } from 'node:crypto'

const value = process.argv[2]

if (value === undefined) {
  console.error('用法：npm run hash -- "要计算的内容"')
  process.exitCode = 1
} else {
  console.log(createHash('sha256').update(value, 'utf8').digest('hex'))
}
