import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import PageShell from '../components/PageShell.jsx'
import { PROJECT_EXAMPLES } from '../utils/projectExamples.js'

function Home() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Field notes"
        title="CAW!"
        tagline="...how are we doing today?"
        showIcon
      />
      <div className="divider reveal reveal--3" aria-hidden="true" />
      <div className="actions reveal reveal--4">
        {PROJECT_EXAMPLES.map((example) => (
          <Link
            key={example.id}
            to={`/lets-see?example=${example.id}`}
            className="btn btn-secondary"
            title={example.description}
          >
            {example.label}
          </Link>
        ))}
        <Link to="/lets-see" className="btn btn-primary">
          Let&apos;s see what&apos;s up
        </Link>
      </div>
    </PageShell>
  )
}

export default Home
