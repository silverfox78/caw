function PageShell({ children, variant = 'default' }) {
  const isWorkspace = variant === 'workspace'

  return (
    <div className="app-shell">
      <div className="app-shell__backdrop" aria-hidden="true" />
      <main className={`page${isWorkspace ? ' page--workspace' : ''}`}>
        <div className={`page__inner${isWorkspace ? ' page__inner--wide' : ''}`}>
          <div
            className={`page__panel${isWorkspace ? ' page__panel--wide' : ' page__panel--with-bird'}`}
          >
            {children}
            {!isWorkspace ? (
              <img
                className="queltehue queltehue--in-panel"
                src={`${import.meta.env.BASE_URL}queltehue.png`}
                alt="Queltehue"
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}

export default PageShell
