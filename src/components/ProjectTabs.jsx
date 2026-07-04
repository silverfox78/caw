function ProjectTabs({ activeTab, onChange }) {
  return (
    <div className="project-tabs" role="tablist" aria-label="Project views">
      <button
        type="button"
        role="tab"
        id="tab-state"
        aria-selected={activeTab === 'state'}
        aria-controls="panel-state"
        className={`project-tabs__tab${activeTab === 'state' ? ' project-tabs__tab--active' : ''}`}
        onClick={() => onChange('state')}
      >
        State
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
        Source
      </button>
    </div>
  )
}

export default ProjectTabs
