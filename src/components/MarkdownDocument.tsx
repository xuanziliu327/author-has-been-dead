import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownDocumentProps {
  source: string
  literary?: boolean
  className?: string
}

export function MarkdownDocument({ source, literary = false, className = '' }: MarkdownDocumentProps) {
  return (
    <article className={`markdown-body ${literary ? 'literary-body' : ''} ${className}`.trim()}>
      <Markdown remarkPlugins={[remarkGfm]}>{source}</Markdown>
    </article>
  )
}
