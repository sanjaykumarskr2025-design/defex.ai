import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      <div className="max-w-2xl">
        {/* User Profile */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={user?.role?.toUpperCase() || ''}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6">API Configuration</h2>
          <p className="text-gray-400 mb-4">
            API Base URL: <code className="text-cyan-500">{import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}</code>
          </p>
          <p className="text-gray-400">Configure the backend API URL via <code className="text-cyan-500">VITE_API_URL</code> environment variable.</p>
        </div>
      </div>
    </div>
  );
};
