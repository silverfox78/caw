import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PROJECT_EXAMPLES } from '../utils/projectExamples.js'

function ExampleLoadButtons({ onLoad, loading, variant = 'default', compact = false }) {
  const { t } = useTranslation()
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary load-prompt__btn'

  return (
    <div className={`example-load-buttons${variant === 'toolbar' ? ' example-load-buttons--toolbar' : ''}`}>
      {variant === 'default' ? (
        <p className="example-load-buttons__label">{t('examples.tryLabel')}</p>
      ) : null}
      <div className="example-load-buttons__group">
        {PROJECT_EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            className={btnClass}
            onClick={() => onLoad(example.id)}
            disabled={loading}
            title={t(`examples.${example.id}.description`)}
          >
            {loading ? t('common.loading') : t(`examples.${example.id}.shortLabel`)}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ExampleOpenLinks({ compact = false }) {
  const { t } = useTranslation()
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary'

  return (
    <div className="example-open-links">
      {PROJECT_EXAMPLES.map((example) => (
        <Link
          key={example.id}
          to={`/lets-see?example=${example.id}`}
          className={btnClass}
          title={t(`examples.${example.id}.description`)}
        >
          {t('examples.open', { name: t(`examples.${example.id}.shortLabel`).toLowerCase() })}
        </Link>
      ))}
    </div>
  )
}

export function ExampleDownloadLinks({ compact = false }) {
  const { t } = useTranslation()
  const btnClass = compact ? 'btn btn-secondary btn--compact' : 'btn btn-secondary'

  return (
    <>
      {PROJECT_EXAMPLES.map((example) => (
        <a
          key={example.id}
          href={example.url}
          download={example.fileName}
          className={btnClass}
          title={t(`examples.${example.id}.description`)}
        >
          {t('examples.download', { name: t(`examples.${example.id}.shortLabel`).toLowerCase() })}
        </a>
      ))}
    </>
  )
}

export default ExampleLoadButtons
