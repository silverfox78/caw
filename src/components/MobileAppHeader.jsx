import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import UiIcon from './UiIcon.jsx'
import { PROJECT_EXAMPLES } from '../utils/projectExamples.js'
import { useMobileActions } from '../context/MobileActionsContext.jsx'
import useIsMobile from '../hooks/useIsMobile.js'

const EXAMPLE_ICONS = {
  basic: 'house',
  advanced: 'map',
}

function MobileAppHeader() {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const location = useLocation()
  const { actions } = useMobileActions()
  const [open, setOpen] = useState(false)

  if (!isMobile) {
    return null
  }

  const isHome = location.pathname === '/'
  const isHelp = location.pathname === '/help'
  const fileLabel = actions?.hasLoadedFile ? t('project.changeFile') : t('loader.chooseFile')

  const handleChooseFile = () => {
    if (actions?.onChooseFile) {
      actions.onChooseFile()
    }
    setOpen(false)
  }

  const handleLoadExample = (exampleId) => {
    if (actions?.onLoadExample) {
      actions.onLoadExample(exampleId)
    }
    setOpen(false)
  }

  return (
    <header className="mobile-header">
      <div className="mobile-header__bar">
        <Link to="/" className="mobile-header__brand" onClick={() => setOpen(false)}>
          CAW
        </Link>

        <button
          type="button"
          className="mobile-header__toggle"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-controls="mobile-header-panel"
          aria-label={open ? t('mobile.closeMenu') : t('mobile.openMenu')}
        >
          <UiIcon name={open ? 'close' : 'menu'} size={18} />
        </button>
      </div>

      <div
        id="mobile-header-panel"
        className={`mobile-header__panel${open ? ' mobile-header__panel--open' : ''}`}
        hidden={!open}
      >
        <div className="mobile-header__section">
          <p className="mobile-header__section-label">{t('lang.switchAria')}</p>
          <LanguageSwitcher variant="inline" />
        </div>

        <div className="mobile-header__actions">
          {actions?.onChooseFile ? (
            <button
              type="button"
              className="mobile-header__action"
              onClick={handleChooseFile}
              disabled={actions.loading}
            >
              <UiIcon name="file" />
              <span>{actions.loading ? t('common.loading') : fileLabel}</span>
            </button>
          ) : (
            <Link
              to="/lets-see"
              className="mobile-header__action"
              onClick={() => setOpen(false)}
            >
              <UiIcon name="file" />
              <span>{t('loader.chooseFile')}</span>
            </Link>
          )}

          {PROJECT_EXAMPLES.map((example) =>
            actions?.onLoadExample ? (
              <button
                key={example.id}
                type="button"
                className="mobile-header__action"
                onClick={() => handleLoadExample(example.id)}
                disabled={actions.loading}
              >
                <UiIcon name={EXAMPLE_ICONS[example.id]} />
                <span>{t(`examples.${example.id}.shortLabel`)}</span>
              </button>
            ) : (
              <Link
                key={example.id}
                to={`/lets-see?example=${example.id}`}
                className="mobile-header__action"
                onClick={() => setOpen(false)}
              >
                <UiIcon name={EXAMPLE_ICONS[example.id]} />
                <span>{t(`examples.${example.id}.shortLabel`)}</span>
              </Link>
            ),
          )}

          {!isHelp ? (
            <Link to="/help" className="mobile-header__action" onClick={() => setOpen(false)}>
              <UiIcon name="help" />
              <span>{t('project.formatGuide')}</span>
            </Link>
          ) : null}

          {!isHome ? (
            <Link to="/" className="mobile-header__action" onClick={() => setOpen(false)}>
              <UiIcon name="house" />
              <span>{t('common.home')}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default MobileAppHeader
