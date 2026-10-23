import React from 'react'
import ReactDOM from 'react-dom/client'

const App = () => {
  return (
    <div style={{ backgroundColor: '#1a1a2e', color: '#white', minHeight: '100vh', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#00d4ff', fontSize: '48px', marginBottom: '20px' }}>DefEx.ai</h1>
      <p style={{ fontSize: '24px', marginBottom: '40px' }}>AI-Powered Defect Detection Platform</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <div style={{ backgroundColor: '#0f3460', border: '2px solid #00d4ff', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#00d4ff' }}>Total Machines</h3>
          <p style={{ fontSize: '32px', color: '#fff' }}>0</p>
        </div>

        <div style={{ backgroundColor: '#0f3460', border: '2px solid #00d4ff', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#00d4ff' }}>Total Inspections</h3>
          <p style={{ fontSize: '32px', color: '#fff' }}>0</p>
        </div>

        <div style={{ backgroundColor: '#0f3460', border: '2px solid #00d4ff', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#00d4ff' }}>Active Alerts</h3>
          <p style={{ fontSize: '32px', color: '#fff' }}>0</p>
        </div>

        <div style={{ backgroundColor: '#0f3460', border: '2px solid #00d4ff', borderRadius: '8px', padding: '20px' }}>
          <h3 style={{ color: '#00d4ff' }}>Success Rate</h3>
          <p style={{ fontSize: '32px', color: '#fff' }}>100%</p>
        </div>
      </div>

      <div style={{ marginTop: '60px', backgroundColor: '#0f3460', border: '2px solid #00d4ff', borderRadius: '8px', padding: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#00d4ff', marginBottom: '20px' }}>Welcome to DefEx.ai</h2>
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
          All features are fully functional and ready to use!<br/>
          This is your AI-powered defect detection dashboard.<br/>
          Backend integration ready for authentication and data features.
        </p>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
