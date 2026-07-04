import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import PageShell from '../components/PageShell.jsx'

function Home() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Field notes"
        title="CAW!"
        tagline="...how are we doing today?"
      />
      <div className="divider reveal reveal--3" aria-hidden="true" />
      <div className="actions reveal reveal--4">
        <Link to="/lets-see?example=1" className="btn btn-secondary">
          See example
        </Link>
        <Link to="/lets-see" className="btn btn-primary">
          Let&apos;s see what&apos;s up
        </Link>
      </div>
    </PageShell>
  )
}

export default Home
