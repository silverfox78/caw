import './App.css'

function App() {
  return (
    <main className="page">
      <div className="content">
        <h1>CAW!</h1>
        <p className="tagline">...how are we doing today?</p>
      </div>
      <img
        className="queltehue"
        src={`${import.meta.env.BASE_URL}queltehue.png`}
        alt="Queltehue"
      />
    </main>
  )
}

export default App
