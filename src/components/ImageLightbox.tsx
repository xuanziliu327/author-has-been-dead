import { useEffect } from 'react'

interface ImageLightboxProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onMouseDown={onClose}>
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="关闭图片">×</button>
      <img src={src} alt={alt} onMouseDown={(event) => event.stopPropagation()} />
    </div>
  )
}
