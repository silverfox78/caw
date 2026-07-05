import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function highlightValue(value) {
  const trimmed = value.trim()

  if (/^\d+$/.test(trimmed)) {
    return <span className="yaml-value yaml-value--number">{value}</span>
  }

  if (/^\d+\.\.\d+$/.test(trimmed)) {
    return <span className="yaml-value yaml-value--range">{value}</span>
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return <span className="yaml-value yaml-value--string">{value}</span>
  }

  if (/^(true|false|null|~)$/i.test(trimmed)) {
    return <span className="yaml-value yaml-value--literal">{value}</span>
  }

  return <span className="yaml-value yaml-value--plain">{value}</span>
}

function renderLineContent(line) {
  if (/^\s*#/.test(line)) {
    return <span className="yaml-comment">{line}</span>
  }

  if (line.trim() === '') {
    return '\u00A0'
  }

  const keyMatch = line.match(/^(\s*)([\w.-]+)(\s*:\s*)(.*)$/)

  if (keyMatch) {
    const [, indent, key, separator, rest] = keyMatch

    return (
      <>
        <span className="yaml-indent">{indent}</span>
        <span className="yaml-key">{key}</span>
        <span className="yaml-punct">{separator}</span>
        {rest ? highlightValue(rest) : null}
      </>
    )
  }

  return <span className="yaml-plain">{line}</span>
}

function resolveDownloadName(fileName) {
  if (!fileName) {
    return 'project.yml'
  }

  if (/\.(yml|yaml)$/i.test(fileName)) {
    return fileName
  }

  return `${fileName.replace(/\.[^.]+$/, '')}.yml`
}

function YamlHighlight({ code, fileName = 'project.yml' }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/yaml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = resolveDownloadName(fileName)
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="yaml-viewer-shell">
      <div className="yaml-viewer__actions">
        <button
          type="button"
          className="yaml-viewer__action"
          onClick={handleCopy}
          aria-live="polite"
        >
          {copied ? t('yaml.copied') : t('yaml.copy')}
        </button>
        <button type="button" className="yaml-viewer__action" onClick={handleDownload}>
          {t('yaml.download')}
        </button>
      </div>

      <pre className="yaml-viewer" aria-label={t('yaml.sourceAria')}>
        <code className="yaml-viewer__code">
          {lines.map((line, index) => (
            <div className="yaml-line-row" key={index}>
              <span className="yaml-line-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="yaml-line">{renderLineContent(line)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}

export default YamlHighlight
