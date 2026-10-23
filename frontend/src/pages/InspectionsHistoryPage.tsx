import { useEffect, useState } from 'react';
import { inspectionAPI } from '../api';
import { AlertTriangle, Eye } from 'lucide-react';

export const InspectionsHistoryPage = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInspection, setSelectedInspection] = useState<any>(null);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const data = await inspectionAPI.list(0, 50);
        setInspections(data.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load inspections');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspections();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Inspection History</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2">
          {inspections.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>No inspections found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  onClick={() => setSelectedInspection(inspection)}
                  className={`bg-gray-800 border rounded-lg p-4 cursor-pointer transition ${
                    selectedInspection?.id === inspection.id
                      ? 'border-cyan-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{inspection.component_name}</h3>
                    <span className={`font-bold ${getSeverityColor(inspection.severity)}`}>
                      {inspection.severity?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Machine: {inspection.machine_name}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(inspection.created_at).toLocaleDateString()} at{' '}
                    {new Date(inspection.created_at).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        {selectedInspection && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold text-cyan-500 mb-6">Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Component</p>
                <p className="text-white font-medium">{selectedInspection.component_name}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Machine</p>
                <p className="text-white font-medium">{selectedInspection.machine_name}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-green-500 font-medium">{selectedInspection.status}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Severity</p>
                <p className={`font-bold ${getSeverityColor(selectedInspection.severity)}`}>
                  {selectedInspection.severity?.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Defects Found</p>
                <div className="mt-2 space-y-2">
                  {selectedInspection.defects?.length > 0 ? (
                    selectedInspection.defects.map((d: any, idx: number) => (
                      <div key={idx} className="bg-gray-700 rounded px-3 py-2">
                        <p className="text-white text-sm">{d.category}</p>
                        <p className="text-gray-400 text-xs">
                          Confidence: {(d.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No defects</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Recommendation</p>
                <p className="text-white mt-2 text-sm">{selectedInspection.recommendation}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white text-sm">
                  {new Date(selectedInspection.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
