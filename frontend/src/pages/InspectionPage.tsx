import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inspectionAPI, componentAPI } from '../api';
import { Upload, Download, AlertTriangle } from 'lucide-react';

export const InspectionPage = () => {
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedMachine, setSelectedMachine] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await componentAPI.list(undefined, 0, 100);
        setComponents(data.items || []);
      } catch (err) {
        setError('Failed to load components');
      }
    };
    fetchComponents();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }
    if (selectedFile && !['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError('Only JPEG and PNG images are supported');
      return;
    }
    setFile(selectedFile || null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedComponent || !selectedMachine) {
      setError('Please select component, machine, and upload an image');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const inspectionResult = await inspectionAPI.create(selectedComponent, selectedMachine, file);
      setResult(inspectionResult);
      setFile(null);
      setSelectedComponent('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Inspection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">AI Inspection</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6">Upload Component Image</h2>

          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Machine</label>
              <select
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Choose a machine...</option>
                {components.map((comp) => (
                  <option key={comp.id} value={comp.machine_id}>
                    {comp.machine_id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Component</label>
              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              >
                <option value="">Choose a component...</option>
                {components.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">Upload Image</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-cyan-500 transition">
                <Upload size={32} className="mx-auto mb-4 text-gray-400" />
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-input"
                  required
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <p className="text-gray-300">{file ? file.name : 'Click to upload or drag and drop'}</p>
                  <p className="text-sm text-gray-400 mt-2">JPEG or PNG up to 10MB</p>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition"
            >
              {isLoading ? 'Processing...' : 'Start Inspection'}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-cyan-500 mb-6">Inspection Results</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <p className="text-lg font-semibold text-green-500">{result.status}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Severity</p>
                <p className={`text-lg font-semibold ${
                  result.severity === 'critical' ? 'text-red-500' :
                  result.severity === 'high' ? 'text-orange-500' :
                  result.severity === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {result.severity?.toUpperCase()}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Detected Defects</p>
                <div className="mt-2 space-y-2">
                  {result.defects?.length > 0 ? (
                    result.defects.map((defect: any, idx: number) => (
                      <div key={idx} className="bg-gray-700 rounded px-3 py-2">
                        <p className="text-white font-medium">{defect.category}</p>
                        <p className="text-gray-400 text-sm">Confidence: {(defect.confidence * 100).toFixed(1)}%</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No defects detected</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Recommendation</p>
                <p className="text-white mt-2">{result.recommendation}</p>
              </div>

              <button
                onClick={() => navigate('/inspections')}
                className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                View All Inspections
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
