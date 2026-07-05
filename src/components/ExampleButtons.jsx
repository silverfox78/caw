import { Link } from 'react-router-dom'
import { PROJECT_EXAMPLES } from '../utils/projectExamples.js'

function ExampleLoadButtons({ onLoad, loading, variant = 'default', compact = false }) {
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary load-prompt__btn'

  return (
    <div className={`example-load-buttons${variant === 'toolbar' ? ' example-load-buttons--toolbar' : ''}`}>
      {variant === 'default' ? (
        <p className="example-load-buttons__label">Or try an example</p>
      ) : null}
      <div className="example-load-buttons__group">
        {PROJECT_EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            className={btnClass}
            onClick={() => onLoad(example.id)}
            disabled={loading}
            title={example.description}
          >
            {loading ? 'Loading…' : example.shortLabel}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ExampleOpenLinks({ compact = false }) {
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary'

  return (
    <div className="example-open-links">
      {PROJECT_EXAMPLES.map((example) => (
        <Link
          key={example.id}
          to={`/lets-see?example=${example.id}`}
          className={btnClass}
          title={example.description}
        >
          Open {example.shortLabel.toLowerCase()} example
        </Link>
      ))}
    </div>
  )
}

export function ExampleDownloadLinks({ compact = false }) {
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary'

  return (
    <>
      {PROJECT_EXAMPLES.map((example) => (
        <a
          key={example.id}
          href={example.url}
          download={example.fileName}
          className={btnClass}
          title={example.description}
        >
          Download {example.shortLabel.toLowerCase()} example
        </a>
      ))}
    </>
  )
}

export default ExampleLoadButtons
