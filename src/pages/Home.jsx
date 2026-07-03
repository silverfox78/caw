import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="page">
      <div className="content">
        <h1>CAW!</h1>
        <p className="tagline">...how are we doing today?</p>
        <div className="actions">
          <button type="button" className="btn btn-secondary">
            See example
          </button>
          <Link to="/lets-see" className="btn btn-primary">
            Let&apos;s see what&apos;s up
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

export default Home
