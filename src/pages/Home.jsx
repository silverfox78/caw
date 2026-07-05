import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader.jsx'
import PageShell from '../components/PageShell.jsx'
import UiIcon from '../components/UiIcon.jsx'
import { PROJECT_EXAMPLES } from '../utils/projectExamples.js'

const EXAMPLE_ICONS = {
  basic: 'house',
  advanced: 'map',
}

function Home() {
  const { t } = useTranslation()

  return (
    <PageShell>
      <div className="home-view">
        <PageHeader
          eyebrow={t('home.eyebrow')}
          title="CAW!"
          tagline={t('home.tagline')}
          showIcon
        />
        <div className="divider reveal reveal--3" aria-hidden="true" />

        <div className="home-view__examples reveal reveal--4">
          {PROJECT_EXAMPLES.map((example) => (
            <Link
              key={example.id}
              to={`/lets-see?example=${example.id}`}
              className="btn btn-secondary btn--icon home-view__example-btn"
              title={t(`examples.${example.id}.description`)}
            >
              <UiIcon name={EXAMPLE_ICONS[example.id]} />
              <span>{t(`examples.${example.id}.shortLabel`)}</span>
            </Link>
          ))}
        </div>

        <div className="actions home-view__cta reveal reveal--5">
          <Link to="/lets-see" className="btn btn-primary btn--icon">
            <UiIcon name="chart" />
            <span>{t('home.cta')}</span>
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

export default Home
