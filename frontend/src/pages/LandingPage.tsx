import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-500">DefEx.ai</h1>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-300 hover:text-cyan-500"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            AI-Powered <span className="text-cyan-500">Defect Detection</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Automatically detect defects, predict maintenance needs, and maximize uptime with cutting-edge computer vision technology.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
          >
            Start Free Trial
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              title: 'Instant Defect Detection',
              desc: 'Automatically identify defects with AI-powered computer vision',
            },
            {
              title: 'Predictive Maintenance',
              desc: 'Prevent failures with predictive maintenance alerts',
            },
            {
              title: 'Detailed Analytics',
              desc: 'Generate comprehensive inspection reports and trends',
            },
            {
              title: 'Team Management',
              desc: 'Collaborate across your organization seamlessly',
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-500 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Operations?</h3>
          <p className="text-gray-300 mb-6">Join thousands of organizations using DefEx.ai</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};
