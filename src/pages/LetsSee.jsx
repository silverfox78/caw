import { Link } from 'react-router-dom'

function LetsSee() {
  return (
    <main className="page">
      <div className="content">
        <h1>Let&apos;s see what&apos;s up</h1>
        <p className="tagline">Something new is coming here.</p>
        <div className="actions">
          <Link to="/" className="btn btn-secondary">
            Back
          </Link>
        </div>
      </div>
      <img
        className="queltehue"
        src={`${import.meta.env.BASE_URL}queltehue.png`}
        alt="Queltehue"
      />
    </main>
  )
}

export default LetsSee
