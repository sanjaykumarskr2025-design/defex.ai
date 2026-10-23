import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineAPI } from '../api';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';

export const MachinesPage = () => {
  const [machines, setMachines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', location: '', status: 'operational' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      const data = await machineAPI.list(0, 50);
      setMachines(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load machines');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await machineAPI.create(formData);
      setFormData({ name: '', type: '', location: '', status: 'operational' });
      setShowForm(false);
      fetchMachines();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create machine');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      try {
        await machineAPI.delete(id);
        fetchMachines();
      } catch (err: any) {
        setError(err.message || 'Failed to delete machine');
      }
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Machines</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Machine
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Machine Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Machine Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg">
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {machines.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No machines found. Create your first machine to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div key={machine.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-cyan-500 mb-2">{machine.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Type: {machine.type}</p>
              <p className="text-gray-400 text-sm mb-4">Location: {machine.location}</p>
              <p className="text-gray-400 text-sm mb-6">
                Status: <span className="text-green-500">{machine.status}</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/machines/${machine.id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  onClick={() => handleDelete(machine.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
