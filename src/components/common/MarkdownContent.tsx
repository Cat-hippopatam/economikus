// src/components/common/MarkdownContent.tsx
/**
 * Компонент для отображения Markdown контента с подсветкой синтаксиса
 */

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Box, Text } from '@mantine/core'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <Text c="dimmed">Контент отсутствует</Text>
  }

  return (
    <Box
      className="markdown-content"
      style={{
        '& pre': {
          margin: '1em 0',
          borderRadius: '8px',
          overflow: 'auto',
        },
        '& code': {
          fontFamily: 'monospace',
        },
        '& p code': {
          backgroundColor: 'var(--mantine-color-gray-1)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.9em',
        },
        '& h1, & h2, & h3, & h4, & h5, & h6': {
          marginTop: '1.5em',
          marginBottom: '0.5em',
        },
        '& ul, & ol': {
          paddingLeft: '1.5em',
          margin: '1em 0',
        },
        '& blockquote': {
          borderLeft: '4px solid var(--mantine-color-blue-5)',
          paddingLeft: '1em',
          marginLeft: 0,
          color: 'var(--mantine-color-gray-6)',
          fontStyle: 'italic',
        },
        '& table': {
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1em 0',
        },
        '& th, & td': {
          border: '1px solid var(--mantine-color-gray-3)',
          padding: '8px 12px',
          textAlign: 'left',
        },
        '& th': {
          backgroundColor: 'var(--mantine-color-gray-1)',
          fontWeight: 600,
        },
        '& img': {
          maxWidth: '100%',
          borderRadius: '8px',
        },
        '& a': {
          color: 'var(--mantine-color-blue-6)',
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !className

            if (isInline) {
              return (
                <code
                  style={{
                    backgroundColor: 'var(--mantine-color-gray-1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                  }}
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match ? match[1] : 'text'}
                PreTag="div"
                customStyle={{
                  margin: '1em 0',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}
