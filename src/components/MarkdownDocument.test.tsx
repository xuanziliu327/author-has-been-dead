import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MarkdownDocument } from './MarkdownDocument'

describe('MarkdownDocument', () => {
  it('renders Markdown emphasis as semantic italic text', () => {
    const { container } = render(<MarkdownDocument source="普通文字 *警官的话* 普通文字" />)
    const emphasis = container.querySelector('em')

    expect(emphasis).toHaveTextContent('警官的话')
  })
})
