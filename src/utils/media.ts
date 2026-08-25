export interface MediaManifest {
  story: boolean
  endingYes: boolean
  endingNo: boolean
  buildVersion: string
}

export const fallbackMediaManifest: MediaManifest = {
  story: false,
  endingYes: false,
  endingNo: false,
  buildVersion: `${Date.now()}`,
}

export function runtimeAssetUrl(fileName: string, buildVersion?: string): string {
  const encodedName = fileName.split('/').map(encodeURIComponent).join('/')
  const version = buildVersion ? `?v=${encodeURIComponent(buildVersion)}` : ''
  return `${import.meta.env.BASE_URL}runtime-assets/${encodedName}${version}`
}

export async function loadMediaManifest(): Promise<MediaManifest> {
  try {
    const url = `${import.meta.env.BASE_URL}runtime-assets/media-manifest.json?t=${Date.now()}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) throw new Error(`media manifest: ${response.status}`)
    const value = await response.json() as MediaManifest
    if (typeof value.buildVersion !== 'string') throw new Error('media manifest 格式错误')
    return value
  } catch (error) {
    console.warn('媒体清单读取失败，将使用占位状态。', error)
    return fallbackMediaManifest
  }
}
