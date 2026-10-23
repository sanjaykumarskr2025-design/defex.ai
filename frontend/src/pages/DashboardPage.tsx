import { useEffect, useState } from 'react';
import { dashboardAPI } from '../api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Zap, Package, Wrench } from 'lucide-react';

export const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, chartsData] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getChartData('30d'),
        ]);
        setStats(statsData);
        setChartData(chartsData);
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

  const COLORS = ['#06b6d4', '#0ea5e9', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

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
