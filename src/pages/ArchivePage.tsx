import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { gameConfig } from '../config/game'
import { archiveEntries, primaryArchiveEntries, textArchiveEntries } from '../content/manifest'
import { runtimeAssetUrl } from '../utils/media'
import { useMediaManifest } from '../context/MediaContext'
import { IdentityDialog } from '../components/IdentityDialog'
import { ImageLightbox } from '../components/ImageLightbox'
import { MarkdownDocument } from '../components/MarkdownDocument'

export function ArchivePage() {
  const location = useLocation()
  const manifest = useMediaManifest()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [textsOpen, setTextsOpen] = useState(location.pathname.includes('/archive/text-'))
  const [identityOpen, setIdentityOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const current = archiveEntries.find((entry) => entry.route === location.pathname)

  useEffect(() => {
    setDrawerOpen(false)
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  if (!current) return <Navigate to="/archive/scene" replace />

  const roomUrl = runtimeAssetUrl(gameConfig.mediaFileNames.roomImage, manifest.buildVersion)
  const pdfUrl = runtimeAssetUrl(gameConfig.mediaFileNames.autopsy, manifest.buildVersion)

  const sidebar = (
    <nav className="archive-nav" aria-label="档案目录">
      <div className="archive-nav-title">档案材料</div>
      {primaryArchiveEntries.map((entry) => (
        <Link key={entry.id} className={current.id === entry.id ? 'active' : ''} to={entry.route}>{entry.label}</Link>
      ))}
      <button
        className={`nav-group-toggle ${textsOpen ? 'open' : ''}`}
        type="button"
        aria-expanded={textsOpen}
        onClick={() => setTextsOpen((value) => !value)}
      >
        <span>疑似死者文件记录册</span><span aria-hidden="true">⌄</span>
      </button>
      {textsOpen && (
        <div className="archive-subnav">
          {textArchiveEntries.map((entry) => (
            <Link key={entry.id} className={current.id === entry.id ? 'active' : ''} to={entry.route}>{entry.label}</Link>
          ))}
        </div>
      )}
    </nav>
  )

  return (
    <main className="archive-shell page-fade">
      <aside className="archive-sidebar">{sidebar}</aside>
      {drawerOpen && <button className="drawer-scrim" type="button" aria-label="关闭目录背景" onClick={() => setDrawerOpen(false)} />}
      <aside className={`archive-drawer ${drawerOpen ? 'open' : ''}`}>
        <button className="drawer-close" type="button" onClick={() => setDrawerOpen(false)}>关闭目录</button>
        {sidebar}
      </aside>

      <header className="archive-toolbar">
        <button className="menu-button" type="button" onClick={() => setDrawerOpen(true)} aria-label="打开档案目录">目录</button>
        <span className="toolbar-current">{current.label}</span>
        <button className="identity-button" type="button" onClick={() => setIdentityOpen(true)}>完善尸体信息</button>
      </header>

      <section className="archive-content">
        {current.kind === 'pdf' ? (
          <div className="pdf-document">
            <div className="document-topline">
              <h1>尸检报告</h1>
              <a href={pdfUrl} target="_blank" rel="noreferrer">在新窗口打开原文件</a>
            </div>
            <iframe src={pdfUrl} title="刘直线法医学尸体检验鉴定书" />
            <p className="pdf-mobile-fallback">当前设备如果无法内嵌显示，请使用上方链接打开原文件。</p>
          </div>
        ) : (
          <>
            <MarkdownDocument source={current.source ?? ''} literary={current.literary} />
            {current.id === 'scene' && (
              <figure className="room-attachment">
                <figcaption>附件：死者房间布局图</figcaption>
                <button type="button" onClick={() => setLightboxOpen(true)} aria-label="放大死者房间布局图">
                  <img src={roomUrl} alt="死者房间布局图" />
                </button>
              </figure>
            )}
          </>
        )}
      </section>

      {identityOpen && <IdentityDialog onClose={() => setIdentityOpen(false)} />}
      {lightboxOpen && <ImageLightbox src={roomUrl} alt="死者房间布局图" onClose={() => setLightboxOpen(false)} />}
    </main>
  )
}
