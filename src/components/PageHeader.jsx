function PageHeader({ eyebrow, title, tagline }) {
  return (
    <header className="page-header">
      {eyebrow ? (
        <p className="page-header__eyebrow reveal reveal--1">{eyebrow}</p>
      ) : null}
      <h1 className="page-header__title reveal reveal--2">{title}</h1>
      {tagline ? (
        <p className="page-header__tagline reveal reveal--3">{tagline}</p>
      ) : null}
    </header>
  )
}

export default PageHeader
