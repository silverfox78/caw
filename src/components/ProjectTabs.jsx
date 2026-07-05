import { useTranslation } from 'react-i18next'

function ProjectTabs({ activeTab, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="project-tabs-wrap">
      <hr className="project-tabs__rule" aria-hidden="true" />
      <div className="project-tabs" role="tablist" aria-label={t('project.tabsAria')}>
        <button
          type="button"
          role="tab"
          id="tab-state"
          aria-selected={activeTab === 'state'}
          aria-controls="panel-state"
          className={`project-tabs__tab${activeTab === 'state' ? ' project-tabs__tab--active' : ''}`}
          onClick={() => onChange('state')}
        >
          {t('tabs.state')}
        </button>
        <button
          type="button"
          role="tab"
          id="tab-source"
          aria-selected={activeTab === 'source'}
          aria-controls="panel-source"
          className={`project-tabs__tab${activeTab === 'source' ? ' project-tabs__tab--active' : ''}`}
          onClick={() => onChange('source')}
        >
          {t('tabs.source')}
        </button>
        <button
          type="button"
          role="tab"
          id="tab-edition"
          aria-selected={activeTab === 'edition'}
          aria-controls="panel-edition"
          className={`project-tabs__tab${activeTab === 'edition' ? ' project-tabs__tab--active' : ''}`}
          onClick={() => onChange('edition')}
        >
          {t('tabs.edition')}
        </button>
      </div>
    </div>
  )
}

export default ProjectTabs
