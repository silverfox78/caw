import CawIcon from './CawIcon.jsx'

function PageHeader({ eyebrow, title, tagline, showIcon = false }) {
  return (
    <header className="page-header">
      {showIcon ? (
        <div className="page-header__icon reveal reveal--1">
          <CawIcon size="xl" />
        </div>
      ) : null}
      {eyebrow ? (
        <p className={`page-header__eyebrow reveal reveal--1${showIcon ? ' page-header__eyebrow--with-icon' : ''}`}>
          {eyebrow}
        </p>
      ) : null}
      <h1 className="page-header__title reveal reveal--2">{title}</h1>
      {tagline ? (
        <p className="page-header__tagline reveal reveal--3">{tagline}</p>
      ) : null}
    </header>
  )
}

export default PageHeader
