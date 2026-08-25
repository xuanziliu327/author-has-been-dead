import { describe, expect, it } from 'vitest'
import { archiveEntries, primaryArchiveEntries, textArchiveEntries } from './manifest'

describe('explicit player content manifest', () => {
  it('keeps the required archive order and only the four literary children', () => {
    expect(primaryArchiveEntries.map((entry) => entry.label)).toEqual([
      '现场勘查摘要',
      '尸检报告',
      '现场提取物品登记表',
      '电子设备检查记录',
      '群众消息语音记录',
    ])
    expect(textArchiveEntries).toHaveLength(4)
    expect(archiveEntries).toHaveLength(9)
  })
})
