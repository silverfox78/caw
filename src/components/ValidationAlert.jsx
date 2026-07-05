import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ExampleDownloadLinks } from './ExampleButtons.jsx'
import CawIcon from './CawIcon.jsx'
import { TEMPLATE_URL } from '../utils/validateProject.js'

function ValidationAlert({ validation, fileName, parseError }) {
  const { t } = useTranslation()

  const issues = parseError
    ? [t('validation.syntaxError', { message: parseError })]
    : validation?.errors?.length
      ? validation.errors
      : [t('validation.fallbackIssue')]

  return (
    <div className="validation-alert" role="alert">
      <div className="validation-alert__visual">
        <CawIcon size="lg" className="validation-alert__image" alt="" />
      </div>

      <div className="validation-alert__body">
        <p className="validation-alert__eyebrow">{t('validation.eyebrow')}</p>
        <h2 className="validation-alert__title">{t('validation.title')}</h2>

        {fileName ? (
          <p className="validation-alert__file">
            {t('common.file')}: <span>{fileName}</span>
          </p>
        ) : null}

        <p className="validation-alert__summary">
          {parseError
            ? t('validation.parseSummary')
            : validation?.summary ?? t('validation.defaultSummary')}
        </p>

        <ul className="validation-alert__list">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>

        <div className="validation-alert__actions">
          <Link to="/help" className="btn btn-primary btn--compact">
            {t('validation.formatGuide')}
          </Link>
          <a href={TEMPLATE_URL} download="template.yml" className="btn btn-secondary btn--compact">
            {t('validation.downloadTemplate')}
          </a>
          <ExampleDownloadLinks compact />
        </div>
      </div>
    </div>
  )
}

export default ValidationAlert
