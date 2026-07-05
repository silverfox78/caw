import { Link } from 'react-router-dom'
import { ExampleDownloadLinks } from './ExampleButtons.jsx'
import { TEMPLATE_URL } from '../utils/validateProject.js'

function ValidationAlert({ validation, fileName, parseError }) {
  const issues = parseError
    ? [`YAML syntax error: ${parseError}`]
    : validation?.errors?.length
      ? validation.errors
      : ['The file format could not be validated.']

  return (
    <div className="validation-alert" role="alert">
      <div className="validation-alert__visual">
        <img
          className="validation-alert__image"
          src={`${import.meta.env.BASE_URL}furious.png`}
          alt=""
        />
      </div>

      <div className="validation-alert__body">
        <p className="validation-alert__eyebrow">Format check</p>
        <h2 className="validation-alert__title">This file needs a little work</h2>

        {fileName ? (
          <p className="validation-alert__file">
            File: <span>{fileName}</span>
          </p>
        ) : null}

        <p className="validation-alert__summary">
          {parseError
            ? 'We could not parse the YAML. Check indentation, colons, and quotes.'
            : validation?.summary ??
              'There is a problem with the file format. A valid project needs `name`, `range`, and `stages`.'}
        </p>

        <ul className="validation-alert__list">
          {issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>

        <div className="validation-alert__actions">
          <Link to="/help" className="btn btn-primary btn--compact">
            Format guide
          </Link>
          <a href={TEMPLATE_URL} download="template.yml" className="btn btn-secondary btn--compact">
            Download template
          </a>
          <ExampleDownloadLinks compact />
        </div>
      </div>
    </div>
  )
}

export default ValidationAlert
