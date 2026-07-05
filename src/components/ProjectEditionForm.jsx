import { useEffect, useState } from 'react'
import StageEditor from './StageEditor.jsx'
import {
  buildDocumentFromForm,
  docToFormState,
  validateEditionForm,
} from '../utils/stageEditTree.js'

function ProjectEditionForm({ document, resetKey, onApply }) {
  const [name, setName] = useState('')
  const [rangeMin, setRangeMin] = useState(0)
  const [rangeMax, setRangeMax] = useState(5)
  const [stageNodes, setStageNodes] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [formMessage, setFormMessage] = useState('')
  const [formMessageKind, setFormMessageKind] = useState('success')

  useEffect(() => {
    if (document) {
      const state = docToFormState(document)
      setName(state.name)
      setRangeMin(state.rangeMin)
      setRangeMax(state.rangeMax)
      setStageNodes(state.stageNodes)
      setFieldErrors({})
      setFormMessage('')
    }
  }, [document, resetKey])

  const handleApply = (event) => {
    event.preventDefault()
    const validation = validateEditionForm({ name, rangeMin, rangeMax, stageNodes })
    setFieldErrors(validation.fieldErrors)

    if (!validation.valid) {
      setFormMessageKind('error')
      setFormMessage(validation.messages[0] ?? 'Fix the highlighted fields before applying.')
      return
    }

    const nextDoc = buildDocumentFromForm({ name, rangeMin, rangeMax, stageNodes })
    onApply(nextDoc)
    setFormMessageKind('success')
    setFormMessage('Changes applied.')
    setFieldErrors({})
  }

  return (
    <form className="edition-form" onSubmit={handleApply} noValidate>
      <div className="edition-form__fields">
        <div className="edition-form__top-row">
          <label className="edition-field edition-field--name">
            <span className="stage-editor__title">Name</span>
            <input
              type="text"
              className={`edition-input${fieldErrors.name ? ' edition-input--invalid' : ''}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'edition-name-error' : undefined}
            />
            {fieldErrors.name ? (
              <span className="edition-field__error" id="edition-name-error">
                {fieldErrors.name}
              </span>
            ) : null}
          </label>

          <div className="edition-form__range-group">
            <label className="edition-field edition-field--range">
              <span className="stage-editor__title">From</span>
            <input
              type="number"
              className={`edition-input edition-input--number${fieldErrors.rangeMin ? ' edition-input--invalid' : ''}`}
              value={rangeMin}
              min={0}
              step={1}
              onChange={(event) => setRangeMin(event.target.value)}
              aria-invalid={Boolean(fieldErrors.rangeMin)}
              aria-describedby={fieldErrors.rangeMin ? 'edition-range-min-error' : undefined}
            />
            {fieldErrors.rangeMin ? (
              <span className="edition-field__error" id="edition-range-min-error">
                {fieldErrors.rangeMin}
              </span>
            ) : null}
            </label>

            <label className="edition-field edition-field--range">
              <span className="stage-editor__title">To</span>
            <input
              type="number"
              className={`edition-input edition-input--number${fieldErrors.rangeMax ? ' edition-input--invalid' : ''}`}
              value={rangeMax}
              min={1}
              step={1}
              onChange={(event) => setRangeMax(event.target.value)}
              aria-invalid={Boolean(fieldErrors.rangeMax)}
              aria-describedby={fieldErrors.rangeMax ? 'edition-range-max-error' : undefined}
            />
            {fieldErrors.rangeMax ? (
              <span className="edition-field__error" id="edition-range-max-error">
                {fieldErrors.rangeMax}
              </span>
            ) : null}
            </label>
          </div>
        </div>

        <hr className="edition-form__divider" />
      </div>

      <div className="edition-form__stages">
        <StageEditor
          nodes={stageNodes}
          onChange={setStageNodes}
          rangeMin={Number(rangeMin) || 0}
          rangeMax={Number(rangeMax) || 5}
          fieldErrors={fieldErrors}
        />
      </div>

      <div className="edition-form__footer">
        {formMessage ? (
          <p
            className={`edition-form__message edition-form__message--${formMessageKind}`}
            role="status"
          >
            {formMessage}
          </p>
        ) : null}
        <button type="submit" className="btn btn-primary btn--compact">
          Apply changes
        </button>
      </div>
    </form>
  )
}

export default ProjectEditionForm
