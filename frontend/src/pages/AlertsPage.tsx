import { useEffect, useState } from 'react';
import { alertAPI } from '../api';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await alertAPI.list(0, 50);
      setAlerts(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await alertAPI.acknowledge(id);
      fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge alert');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await alertAPI.resolve(id);
      fetchAlerts();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve alert');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-900 border-red-700';
      case 'high':
        return 'bg-orange-900 border-orange-700';
      case 'medium':
        return 'bg-yellow-900 border-yellow-700';
      default:
        return 'bg-blue-900 border-blue-700';
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Alerts & Notifications</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">{error}</div>
      )}

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
          <p>No active alerts. Everything is running smoothly!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-6 ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                    <p className="text-gray-200 mt-2">{alert.description}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-black bg-opacity-50 rounded text-sm font-medium">
                  {alert.priority?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-300">Machine</p>
                  <p className="text-white font-medium">{alert.machine_name}</p>
                </div>
                <div>
                  <p className="text-gray-300">Component</p>
                  <p className="text-white font-medium">{alert.component_name}</p>
                </div>
                <div>
                  <p className="text-gray-300">Status</p>
                  <p className="text-white font-medium capitalize">{alert.status}</p>
                </div>
                <div>
                  <p className="text-gray-300">Created</p>
                  <p className="text-white font-medium text-xs">
                    {new Date(alert.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {alert.status !== 'acknowledged' && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                  >
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
