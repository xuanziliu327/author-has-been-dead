import noticeSource from '../../第一章/协查通告.md?raw'
import sceneSource from '../../第一章/现场勘查摘要.md?raw'
import itemsSource from '../../第一章/现场提取物品登记表.md?raw'
import deviceSource from '../../第一章/电子设备检查记录.md?raw'
import callsSource from '../../第一章/群众消息语音记录.md?raw'
import nitanSource from '../../第一章/疑似死者文件记录册/关于《泥潭》.md?raw'
import xiaomanSource from '../../第一章/疑似死者文件记录册/小满（if）.md?raw'
import sadManSource from '../../第一章/疑似死者文件记录册/一个悲伤男人的故事.md?raw'
import novelSource from '../../第一章/疑似死者文件记录册/一部真正的小说应该是什么样子的.md?raw'
import hiddenSource from '../../第一章/隐藏页文档.md?raw'

export type ContentKind = 'markdown' | 'pdf'

export interface ContentEntry {
  id: string
  label: string
  route: string
  kind: ContentKind
  source?: string
  group?: 'texts'
  literary?: boolean
}

export const noticeMarkdown = noticeSource
export const hiddenMarkdown = hiddenSource

export const archiveEntries: readonly ContentEntry[] = [
  { id: 'scene', label: '现场勘查摘要', route: '/archive/scene', kind: 'markdown', source: sceneSource },
  { id: 'autopsy', label: '尸检报告', route: '/archive/autopsy', kind: 'pdf' },
  { id: 'items', label: '现场提取物品登记表', route: '/archive/items', kind: 'markdown', source: itemsSource },
  { id: 'device', label: '电子设备检查记录', route: '/archive/device', kind: 'markdown', source: deviceSource },
  { id: 'calls', label: '群众消息语音记录', route: '/archive/calls', kind: 'markdown', source: callsSource },
  { id: 'nitan', label: '关于《泥潭》', route: '/archive/text-nitan', kind: 'markdown', source: nitanSource, group: 'texts', literary: true },
  { id: 'xiaoman', label: '小满（if）', route: '/archive/text-xiaoman', kind: 'markdown', source: xiaomanSource, group: 'texts', literary: true },
  { id: 'sad-man', label: '一个悲伤男人的故事', route: '/archive/text-sad-man', kind: 'markdown', source: sadManSource, group: 'texts', literary: true },
  { id: 'novel', label: '一部真正的小说应该是什么样子的', route: '/archive/text-novel', kind: 'markdown', source: novelSource, group: 'texts', literary: true },
]

export const primaryArchiveEntries = archiveEntries.filter((entry) => !entry.group)
export const textArchiveEntries = archiveEntries.filter((entry) => entry.group === 'texts')
