import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { load as parseYaml } from 'js-yaml'
import PageShell from '../components/PageShell.jsx'
import ProjectTabs from '../components/ProjectTabs.jsx'
import StageStateView from '../components/StageStateView.jsx'
import ValidationAlert from '../components/ValidationAlert.jsx'
import YamlHighlight from '../components/YamlHighlight.jsx'
import { validateProjectDocument } from '../utils/validateProject.js'

const EXAMPLE_URL = `${import.meta.env.BASE_URL}examples/house.yml`
const EXAMPLE_NAME = 'house.yml'

function LoadPrompt({
  onChooseFile,
  onLoadExample,
  loading,
  loadError,
  fileInputRef,
  onFileChange,
}) {
  return (
    <div className="load-prompt">
      <p className="load-prompt__eyebrow reveal reveal--1">Project loader</p>
      <h1 className="load-prompt__title reveal reveal--2">Choose a .yml file</h1>
      <p className="load-prompt__hint reveal reveal--3">
        Pick a local YAML file or start from the built-in house example.
      </p>

      <div className="load-prompt__dropzone reveal reveal--4">
        <span className="load-prompt__icon" aria-hidden="true">
          YML
        </span>
        <div className="load-prompt__actions">
          <button
            type="button"
            className="btn btn-primary load-prompt__btn"
            onClick={onChooseFile}
          >
            Choose file
          </button>
          <button
            type="button"
            className="btn btn-secondary load-prompt__btn"
            onClick={onLoadExample}
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Load example'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".yml,.yaml,text/yaml,application/x-yaml"
          className="loader__input"
          onChange={onFileChange}
        />
      </div>

      {loadError ? (
        <p className="viewer__error" role="alert">
          {loadError}
        </p>
      ) : null}

      <p className="load-prompt__help-link">
        <Link to="/help">Need help with the file format?</Link>
      </p>

      <div className="actions load-prompt__back">
        <Link to="/" className="btn btn-secondary">
          Back
        </Link>
      </div>
    </div>
  )
}

function LetsSee() {
  const [searchParams, setSearchParams] = useSearchParams()
  const wantsExample = searchParams.get('example') === '1'

  const [source, setSource] = useState(null)
  const [raw, setRaw] = useState('')
  const [parsed, setParsed] = useState(null)
  const [validation, setValidation] = useState(null)
  const [parseError, setParseError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('state')
  const fileInputRef = useRef(null)

  const loadFromText = useCallback((text, originLabel) => {
    setRaw(text)
    setSource(originLabel)
    setActiveTab('state')
    setLoadError('')

    try {
      const doc = parseYaml(text)
      const result = validateProjectDocument(doc, text)

      setParsed(doc)
      setParseError('')
      setValidation(result.valid ? null : result)
    } catch (err) {
      setParsed(null)
      setValidation(null)
      setParseError(err?.message ?? 'Could not parse the YAML file.')
    }
  }, [])

  const loadExample = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch(EXAMPLE_URL)
      if (!res.ok) {
        throw new Error(`Could not load the example (HTTP ${res.status}).`)
      }
      const text = await res.text()
      loadFromText(text, EXAMPLE_NAME)
    } catch (err) {
      setLoadError(err?.message ?? 'Could not load the example.')
      setSource(null)
      setRaw('')
      setParsed(null)
      setValidation(null)
      setParseError('')
    } finally {
      setLoading(false)
    }
  }, [loadFromText])

  useEffect(() => {
    if (wantsExample && !source) {
      loadExample()
    }
  }, [wantsExample, source, loadExample])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (wantsExample) {
      setSearchParams({}, { replace: true })
    }
    const reader = new FileReader()
    reader.onload = () => loadFromText(String(reader.result), file.name)
    reader.onerror = () => setLoadError('Could not read the file.')
    reader.readAsText(file)
  }

  const isValid = parsed && !validation && !parseError
  const projectName =
    parsed && typeof parsed === 'object' && parsed.name ? parsed.name : source
  const showLoadedView = Boolean(source && raw)

  return (
    <PageShell variant="workspace">
      {loading && !source ? (
        <div className="load-prompt load-prompt--loading">
          <p className="load-prompt__hint">Loading example…</p>
        </div>
      ) : null}

      {!showLoadedView && !loading ? (
        <LoadPrompt
          onChooseFile={() => fileInputRef.current?.click()}
          onLoadExample={loadExample}
          loading={loading}
          loadError={loadError}
          fileInputRef={fileInputRef}
          onFileChange={handleFile}
        />
      ) : null}

      {showLoadedView ? (
        <div className="project-view">
          <header className="project-view__header">
            <p className="project-view__context">Let&apos;s see what&apos;s up</p>
            <h1 className="project-view__title">{projectName}</h1>
            <p className="project-view__origin">
              <span className="project-view__origin-label">Origin</span>
              {source}
            </p>
          </header>

          <div className="project-view__toolbar">
            <button
              type="button"
              className="btn btn-secondary btn--compact"
              onClick={() => fileInputRef.current?.click()}
            >
              Change file
            </button>
            <button
              type="button"
              className="btn btn-secondary btn--compact"
              onClick={loadExample}
              disabled={loading}
            >
              Load example
            </button>
            <Link to="/help" className="btn btn-secondary btn--compact">
              Format guide
            </Link>
            <input
              ref={fileInputRef}
              type="file"
              accept=".yml,.yaml,text/yaml,application/x-yaml"
              className="loader__input"
              onChange={handleFile}
            />
          </div>

          {validation || parseError ? (
            <ValidationAlert
              validation={validation}
              parseError={parseError}
              fileName={source}
            />
          ) : null}

          <section className="project-view__content" aria-live="polite">
            <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

            <div
              role="tabpanel"
              id="panel-state"
              aria-labelledby="tab-state"
              hidden={activeTab !== 'state'}
              className="project-view__panel"
            >
              {activeTab === 'state' ? (
                isValid ? (
                  <StageStateView parsed={parsed} />
                ) : (
                  <p className="state-view__message">
                    Fix the format issues above to see project state.
                  </p>
                )
              ) : null}
            </div>

            <div
              role="tabpanel"
              id="panel-source"
              aria-labelledby="tab-source"
              hidden={activeTab !== 'source'}
              className="project-view__panel"
            >
              {activeTab === 'source' ? <YamlHighlight code={raw} /> : null}
            </div>
          </section>

          <div className="actions project-view__back">
            <Link to="/" className="btn btn-secondary btn--compact">
              Back
            </Link>
          </div>
        </div>
      ) : null}
    </PageShell>
  )
}

export default LetsSee
