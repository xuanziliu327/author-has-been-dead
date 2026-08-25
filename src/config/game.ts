export interface GameConfig {
  riverIntervalMs: number
  riverNormalVolume: number
  riverContinuousVolume: number
  specialDate: { year: number; month: number; day: number }
  passwordHash: string
  identityNameHash: string
  identityAgeHashes: readonly string[]
  creditsLines: readonly string[]
  creditsDurationMs: number
  creditsFadeMs: number
  yesEndingLoopsRiver: boolean
  noEndingPlaysGasp: boolean
  noEndingReturnRoute: string
  mediaFileNames: {
    river: string
    button: string
    gasp: string
    story: string
    endingYes: string
    endingNo: string
    autopsy: string
    roomImage: string
  }
}

export const gameConfig: GameConfig = {
  riverIntervalMs: 300_000,
  riverNormalVolume: 0.34,
  riverContinuousVolume: 0.48,
  specialDate: { year: 2026, month: 11, day: 23 },
  passwordHash: 'e0c51191f503e45214154c5868c568e62c84a57b4751c14002aecf2d48d17806',
  identityNameHash: '961c4013828abe2f2bbe37cbb1fe4fdc8b1978ddcf1762e9e0d78242445e9994',
  identityAgeHashes: [
    '9400f1b21cb527d7fa3d3eabba93557a18ebe7a2ca4e471cfe5e4c5b4ca7f767',
    'f5ca38f748a1d6eaf726b8a42fb575c3c71f1864a8143301782de13da2d9202b',
  ],
  creditsLines: [
    '作者已死',
    '策划：lzx',
    '编辑：lzx',
    '文稿：lzx',
    '投资方：lzx的爹妈',
    '美术：chatgpt和lzx',
  ],
  creditsDurationMs: 10_000,
  creditsFadeMs: 700,
  yesEndingLoopsRiver: true,
  noEndingPlaysGasp: true,
  noEndingReturnRoute: '#/',
  mediaFileNames: {
    river: 'river.mp3',
    button: 'button.mp3',
    gasp: 'gasp.mp3',
    story: 'story.mp3',
    endingYes: 'ending_yes.mp4',
    endingNo: 'ending_no.mp4',
    autopsy: '刘直线_法医学尸体检验鉴定书_v7.pdf',
    roomImage: '死者房间布局图.png',
  },
}
