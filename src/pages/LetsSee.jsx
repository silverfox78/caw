import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { load as parseYaml } from 'js-yaml'
import PageShell from '../components/PageShell.jsx'
import ProjectTabs from '../components/ProjectTabs.jsx'
import StageStateView from '../components/StageStateView.jsx'
import ValidationAlert from '../components/ValidationAlert.jsx'
import YamlHighlight from '../components/YamlHighlight.jsx'
import ProjectEditionForm from '../components/ProjectEditionForm.jsx'
import ExampleLoadButtons from '../components/ExampleButtons.jsx'
import CawIcon from '../components/CawIcon.jsx'
import { useRegisterMobileActions } from '../context/MobileActionsContext.jsx'
import { getExampleById, resolveExampleFromSearchParam } from '../utils/projectExamples.js'
import { validateProjectDocument } from '../utils/validateProject.js'
import { sanitizeProjectDocument } from '../utils/sanitizeProject.js'

function LoadPrompt({
  onChooseFile,
  onLoadExample,
  loading,
  loadError,
}) {
  const { t } = useTranslation()

  return (
    <div className="load-prompt">
      <p className="load-prompt__eyebrow reveal reveal--1">{t('loader.eyebrow')}</p>
      <h1 className="load-prompt__title reveal reveal--2">{t('loader.title')}</h1>
      <p className="load-prompt__hint reveal reveal--3">{t('loader.hint')}</p>

      <div className="load-prompt__dropzone reveal reveal--4">
        <CawIcon size="lg" className="load-prompt__icon" alt="" />
        <p className="load-prompt__mobile-hint">{t('mobile.loaderHint')}</p>
        <div className="load-prompt__actions mobile-hide">
          <button
            type="button"
            className="btn btn-primary load-prompt__btn"
            onClick={onChooseFile}
          >
            {t('loader.chooseFile')}
          </button>
          <ExampleLoadButtons onLoad={onLoadExample} loading={loading} />
        </div>
      </div>

      {loadError ? (
        <p className="viewer__error" role="alert">
          {loadError}
        </p>
      ) : null}

      <p className="load-prompt__help-link mobile-hide">
        <Link to="/help">{t('loader.helpLink')}</Link>
      </p>

      <div className="actions load-prompt__back mobile-hide">
        <Link to="/" className="btn btn-secondary">
          {t('common.back')}
        </Link>
      </div>
    </div>
  )
}

function LetsSee() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const exampleParam = searchParams.get('example')
  const pendingExample = resolveExampleFromSearchParam(exampleParam)

  const [source, setSource] = useState(null)
  const [raw, setRaw] = useState('')
  const [displayYaml, setDisplayYaml] = useState('')
  const [parsed, setParsed] = useState(null)
  const [validation, setValidation] = useState(null)
  const [parseError, setParseError] = useState('')
  const [loadError, setLoadError] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('state')
  const fileInputRef = useRef(null)

  const handleEditionApply = useCallback((doc) => {
    const { doc: normalized, yaml } = sanitizeProjectDocument(doc)
    setParsed(normalized)
    setDisplayYaml(yaml)
    setRaw(yaml)
    setValidation(null)
  }, [])

  const loadFromText = useCallback(
    (text, originLabel) => {
      setRaw(text)
      setSource(originLabel)
      setActiveTab('state')
      setLoadError('')

      try {
        const doc = parseYaml(text)
        const result = validateProjectDocument(doc, text)

        if (result.valid) {
          const { doc: normalized, yaml } = sanitizeProjectDocument(doc)
          setParsed(normalized)
          setDisplayYaml(yaml)
        } else {
          setParsed(doc)
          setDisplayYaml('')
        }

        setParseError('')
        setValidation(result.valid ? null : result)
      } catch (err) {
        setParsed(null)
        setDisplayYaml('')
        setParseError(err?.message ?? t('loader.parseError'))
      }
    },
    [t],
  )

  const loadExample = useCallback(
    async (exampleId = 'basic') => {
      const example = getExampleById(exampleId)

      if (!example) {
        setLoadError(t('loader.unknownExample'))
        return
      }

      setLoading(true)
      setLoadError('')

      try {
        const res = await fetch(example.url)

        if (!res.ok) {
          throw new Error(t('loader.httpError', { status: res.status }))
        }

        const text = await res.text()
        loadFromText(text, example.fileName)
        setSearchParams({ example: example.id }, { replace: true })
      } catch (err) {
        setLoadError(err?.message ?? t('loader.loadExampleError'))
        setSource(null)
        setRaw('')
        setParsed(null)
        setDisplayYaml('')
        setValidation(null)
        setParseError('')
      } finally {
        setLoading(false)
      }
    },
    [loadFromText, setSearchParams, t],
  )

  useEffect(() => {
    if (pendingExample && !source) {
      loadExample(pendingExample.id)
    }
  }, [pendingExample, source, loadExample])

  const handleFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (exampleParam) {
      setSearchParams({}, { replace: true })
    }
    const reader = new FileReader()
    reader.onload = () => loadFromText(String(reader.result), file.name)
    reader.onerror = () => setLoadError(t('loader.readFileError'))
    reader.readAsText(file)
  }

  const projectName =
    parsed && typeof parsed === 'object' && parsed.name ? parsed.name : source
  const showLoadedView = Boolean(source && raw)

  const chooseFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const mobileActions = useMemo(
    () => ({
      onChooseFile: chooseFile,
      onLoadExample: loadExample,
      loading,
      hasLoadedFile: showLoadedView,
    }),
    [chooseFile, loadExample, loading, showLoadedView],
  )

  useRegisterMobileActions(mobileActions)

  return (
    <PageShell variant="workspace">
      <input
        ref={fileInputRef}
        type="file"
        accept=".yml,.yaml,text/yaml,application/x-yaml"
        className="loader__input"
        onChange={handleFile}
      />

      {loading && !source ? (
        <div className="load-prompt load-prompt--loading">
          <p className="load-prompt__hint">{t('common.loadingExample')}</p>
        </div>
      ) : null}

      {!showLoadedView && !loading ? (
        <LoadPrompt
          onChooseFile={chooseFile}
          onLoadExample={loadExample}
          loading={loading}
          loadError={loadError}
        />
      ) : null}

      {showLoadedView ? (
        <div className="project-view">
          <header className="project-view__header">
            <p className="project-view__context">{t('project.context')}</p>
            <h1 className="project-view__title">{projectName}</h1>
            <p className="project-view__origin">
              <span className="project-view__origin-label">{t('common.origin')}</span>
              {source}
            </p>
          </header>

          <div className="project-view__toolbar mobile-hide">
            <button
              type="button"
              className="btn btn-secondary btn--compact"
              onClick={chooseFile}
            >
              {t('project.changeFile')}
            </button>
            <ExampleLoadButtons
              onLoad={loadExample}
              loading={loading}
              variant="toolbar"
              compact
            />
            <Link to="/help" className="btn btn-secondary btn--compact">
              {t('project.formatGuide')}
            </Link>
          </div>

          {validation || parseError ? (
            <ValidationAlert
              validation={validation}
              parseError={parseError}
              fileName={source}
            />
          ) : (
            <section className="project-view__content" aria-live="polite">
              <ProjectTabs activeTab={activeTab} onChange={setActiveTab} />

              <div
                role="tabpanel"
                id="panel-state"
                aria-labelledby="tab-state"
                hidden={activeTab !== 'state'}
                className="project-view__panel"
              >
                {activeTab === 'state' ? <StageStateView parsed={parsed} /> : null}
              </div>

              <div
                role="tabpanel"
                id="panel-source"
                aria-labelledby="tab-source"
                hidden={activeTab !== 'source'}
                className="project-view__panel"
              >
                {activeTab === 'source' ? (
                  <YamlHighlight code={displayYaml} fileName={source} />
                ) : null}
              </div>

              <div
                role="tabpanel"
                id="panel-edition"
                aria-labelledby="tab-edition"
                hidden={activeTab !== 'edition'}
                className="project-view__panel"
              >
                {activeTab === 'edition' ? (
                  <ProjectEditionForm
                    document={parsed}
                    resetKey={displayYaml}
                    onApply={handleEditionApply}
                  />
                ) : null}
              </div>
            </section>
          )}

          <div className="actions project-view__back mobile-hide">
            <Link to="/" className="btn btn-secondary btn--compact">
              {t('common.back')}
            </Link>
          </div>
        </div>
      ) : null}
    </PageShell>
  )
}

export default LetsSee
