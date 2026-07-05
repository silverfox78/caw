import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageShell from '../components/PageShell.jsx'
import { EXAMPLE_URL, TEMPLATE_URL } from '../utils/validateProject.js'

function Help() {
  const { t } = useTranslation()

  return (
    <PageShell variant="workspace">
      <div className="help-view">
        <header className="help-view__header">
          <p className="help-view__eyebrow">{t('help.eyebrow')}</p>
          <h1 className="help-view__title">{t('help.title')}</h1>
          <p className="help-view__intro">{t('help.intro')}</p>
        </header>

        <section className="help-view__section">
          <h2>{t('help.requiredFields')}</h2>
          <div className="help-view__cards">
            <article className="help-view__card">
              <h3>{t('help.nameTitle')}</h3>
              <p>{t('help.nameDesc')}</p>
              <pre>{`name: House in construction`}</pre>
            </article>
            <article className="help-view__card">
              <h3>{t('help.rangeTitle')}</h3>
              <p>{t('help.rangeDesc')}</p>
              <pre>{`range: 0..5`}</pre>
            </article>
            <article className="help-view__card">
              <h3>{t('help.stagesTitle')}</h3>
              <p>{t('help.stagesDesc')}</p>
              <pre>{`stages:
  foundations:
    concrete: 4
  other: 1`}</pre>
            </article>
          </div>
        </section>

        <section className="help-view__section">
          <h2>{t('help.rulesTitle')}</h2>
          <ul className="help-view__list">
            <li>{t('help.rule1')}</li>
            <li>{t('help.rule2')}</li>
            <li>{t('help.rule3')}</li>
            <li>{t('help.rule4')}</li>
            <li>{t('help.rule5')}</li>
            <li>{t('help.rule6')}</li>
          </ul>
        </section>

        <section className="help-view__section">
          <h2>{t('help.startTitle')}</h2>
          <p className="help-view__intro">{t('help.startIntro')}</p>
          <div className="help-view__actions">
            <a href={TEMPLATE_URL} download="template.yml" className="btn btn-primary">
              {t('help.downloadTemplate')}
            </a>
            <a href={EXAMPLE_URL} download="house.yml" className="btn btn-secondary">
              {t('help.downloadHouse')}
            </a>
            <Link to="/lets-see?example=1" className="btn btn-secondary">
              {t('help.openHouse')}
            </Link>
          </div>
        </section>

        <div className="actions help-view__back">
          <Link to="/lets-see" className="btn btn-secondary btn--compact">
            {t('help.backToLoader')}
          </Link>
          <Link to="/" className="btn btn-secondary btn--compact">
            {t('common.home')}
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

export default Help
