import LanguageSwitcher from './LanguageSwitcher.jsx'
import MobileAppHeader from './MobileAppHeader.jsx'

function PageShell({ children, variant = 'default' }) {
  const isWorkspace = variant === 'workspace'

  return (
    <div className={`app-shell${isWorkspace ? ' app-shell--workspace' : ' app-shell--home'}`}>
      <MobileAppHeader />
      <LanguageSwitcher variant="floating" />
      <div className="app-shell__backdrop" aria-hidden="true" />
      <main className={`page${isWorkspace ? ' page--workspace' : ' page--home'}`}>
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
