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

function highlightLine(line, index) {
  if (/^\s*#/.test(line)) {
    return (
      <div className="yaml-line" key={index}>
        <span className="yaml-comment">{line}</span>
      </div>
    )
  }

  if (line.trim() === '') {
    return <div className="yaml-line yaml-line--empty" key={index}>&nbsp;</div>
  }

  const keyMatch = line.match(/^(\s*)([\w.-]+)(\s*:\s*)(.*)$/)

  if (keyMatch) {
    const [, indent, key, separator, rest] = keyMatch

    return (
      <div className="yaml-line" key={index}>
        <span className="yaml-indent">{indent}</span>
        <span className="yaml-key">{key}</span>
        <span className="yaml-punct">{separator}</span>
        {rest ? highlightValue(rest) : null}
      </div>
    )
  }

  return (
    <div className="yaml-line" key={index}>
      <span className="yaml-plain">{line}</span>
    </div>
  )
}

function YamlHighlight({ code }) {
  const lines = code.split('\n')

  return (
    <pre className="yaml-viewer" aria-label="YAML source">
      <code className="yaml-viewer__code">
        {lines.map((line, index) => highlightLine(line, index))}
      </code>
    </pre>
  )
}

export default YamlHighlight
