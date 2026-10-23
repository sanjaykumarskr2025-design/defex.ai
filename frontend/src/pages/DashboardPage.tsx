import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import { AlertTriangle, Zap, Package } from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await dashboardAPI.getStats();
        setStats(statsData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">DefEx.ai Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 hover:bg-blue-800 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-semibold">Total Machines</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.total_machines || 0}</p>
            </div>
            <Zap size={40} className="text-blue-400 opacity-70" />
          </div>
        </div>

        <div className="bg-cyan-900 border border-cyan-700 rounded-lg p-6 hover:bg-cyan-800 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-sm font-semibold">Total Components</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.total_components || 0}</p>
            </div>
            <Package size={40} className="text-cyan-400 opacity-70" />
          </div>
        </div>

        <div className="bg-purple-900 border border-purple-700 rounded-lg p-6 hover:bg-purple-800 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 text-sm font-semibold">Total Inspections</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.total_inspections || 0}</p>
            </div>
            <AlertTriangle size={40} className="text-purple-400 opacity-70" />
          </div>
        </div>

        <div className="bg-red-900 border border-red-700 rounded-lg p-6 hover:bg-red-800 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-semibold">Active Alerts</p>
              <p className="text-4xl font-bold text-white mt-2">{stats?.active_alerts || 0}</p>
            </div>
            <AlertTriangle size={40} className="text-red-400 opacity-70" />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome to DefEx.ai</h2>
        <p className="text-gray-300 mb-6">AI-Powered Defect Detection Platform</p>
        <p className="text-gray-400">All features are fully functional and ready to use!</p>
      </div>
    </div>
  );
};

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Machines</p>
              <p className="text-3xl font-bold text-cyan-500">{stats?.total_machines || 0}</p>
            </div>
            <Zap size={32} className="text-cyan-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Components</p>
              <p className="text-3xl font-bold text-blue-500">{stats?.total_components || 0}</p>
            </div>
            <Package size={32} className="text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inspections</p>
              <p className="text-3xl font-bold text-purple-500">{stats?.total_inspections || 0}</p>
            </div>
            <Zap size={32} className="text-purple-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-3xl font-bold text-red-500">{stats?.active_alerts || 0}</p>
            </div>
            <AlertTriangle size={32} className="text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData?.inspections_timeline && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Inspections Timeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.inspections_timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartData?.defect_distribution && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Defect Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.defect_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.defect_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Severity Distribution */}
      {chartData?.severity_distribution && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.severity_distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
