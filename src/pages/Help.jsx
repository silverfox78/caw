import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell.jsx'
import { TEMPLATE_URL, TRAVEL_EXAMPLE_URL } from '../utils/validateProject.js'
import { ExampleDownloadLinks, ExampleOpenLinks } from '../components/ExampleButtons.jsx'

function Help() {
  return (
    <PageShell variant="workspace">
      <div className="help-view">
        <header className="help-view__header">
          <p className="help-view__eyebrow">Project format</p>
          <h1 className="help-view__title">How to prepare your .yml file</h1>
          <p className="help-view__intro">
            CAW reads a simple YAML document. These three top-level fields are mandatory and
            must appear once each.
          </p>
        </header>

        <section className="help-view__section">
          <h2>Required fields</h2>
          <div className="help-view__cards">
            <article className="help-view__card">
              <h3>name</h3>
              <p>Human-readable project title shown in the app.</p>
              <pre>{`name: House in construction`}</pre>
            </article>
            <article className="help-view__card">
              <h3>range</h3>
              <p>Progress scale for leaf values. Minimum and maximum separated by <code>..</code>.</p>
              <pre>{`range: 0..5`}</pre>
            </article>
            <article className="help-view__card">
              <h3>stages</h3>
              <p>Nested tree of stages. Branches are objects; leaves are numbers within range.</p>
              <pre>{`stages:
  foundations:
    concrete: 4
  other: 1`}</pre>
            </article>
          </div>
        </section>

        <section className="help-view__section">
          <h2>Optional: stage weights</h2>
          <p className="help-view__intro">
            Prefix a stage name with a number in parentheses to set its share among siblings.
            Values must be between 0 and 100. When you use weights at a level, they must add up
            to 100. See the{' '}
            <a href={TRAVEL_EXAMPLE_URL} download="travel.yml">
              travel planning example
            </a>{' '}
            for a full project.
          </p>
          <pre>{`name: Patagonia trip
range: 0..5

stages:
  (50)planning:
    (40)research:
      destination: 5
      dates: 4
    (35)budget:
      flights: 4
      lodging: 3
    (25)logistics:
      visas: 5
      insurance: 4
  (30)booking:
    transport:
      flights: 5
    stays:
      hotels: 4
  (20)travel:
    outbound: 5
    on_the_road: 2`}</pre>
          <ul className="help-view__list">
            <li>
              <code>(70)planning</code> means planning represents 70% of its parent level.
            </li>
            <li>Sibling weights must total 100. CAW rejects files where they sum to more than 100.</li>
            <li>
              If some siblings omit a weight, the remaining percentage is split among them. If
              stated weights total less than 100 with no unweighted siblings, they are scaled
              proportionally.
            </li>
            <li>
              In State and Edition, progress is shown as achieved share vs. cap (e.g.{' '}
              <code>49% / 70%</code>).
            </li>
          </ul>
        </section>

        <section className="help-view__section">
          <h2>Rules of thumb</h2>
          <ul className="help-view__list">
            <li>Use spaces for indentation (two spaces per level is a good default).</li>
            <li>Only numeric leaves count toward progress; missing leaves are treated as the minimum of <code>range</code>.</li>
            <li>Child stages may be written as a map or as a YAML list with <code>- item</code>; lists are normalized automatically.</li>
            <li>Parent progress rolls up from children; optional weights change how siblings contribute (see above).</li>
            <li>Lines starting with <code>#</code> are comments and are ignored.</li>
            <li>Do not repeat <code>name</code>, <code>range</code>, or <code>stages</code> at the top level.</li>
          </ul>
        </section>

        <section className="help-view__section">
          <h2>Start from a file</h2>
          <p className="help-view__intro">
            Download a minimal template, the house example, or the travel example with weights,
            edit locally, then load it back in CAW.
          </p>
          <div className="help-view__actions">
            <a href={TEMPLATE_URL} download="template.yml" className="btn btn-primary">
              Download template
            </a>
            <ExampleDownloadLinks />
            <ExampleOpenLinks />
          </div>
        </section>

        <div className="actions help-view__back">
          <Link to="/lets-see" className="btn btn-secondary btn--compact">
            Back to loader
          </Link>
          <Link to="/" className="btn btn-secondary btn--compact">
            Home
          </Link>
        </div>
      </div>
    </PageShell>
  )
}

export default Help
