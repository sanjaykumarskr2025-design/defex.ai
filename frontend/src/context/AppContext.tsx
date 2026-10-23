import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'maintenance';
  lastActive: string;
  uptime: string;
}

export interface InspectionItem {
  id: string;
  partId: string;
  partType: string;
  machine: string;
  timestamp: string;
  duration: string;
  status: 'PASS' | 'FAIL' | 'UNCERTAIN';
  confidence: number;
  defects?: string[];
  dimensions: string;
}

export interface AlertItem {
  id: string;
  title: string;
  machine: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  acknowledged?: boolean;
}

interface AppContextType {
  machines: Machine[];
  inspections: InspectionItem[];
  alerts: AlertItem[];
  addInspection: (item: InspectionItem) => void;
  toggleMachineStatus: (id: string) => void;
  addMachine: (name: string, type: string) => void;
  acknowledgeAlert: (id: string) => void;
}

const initialMachines: Machine[] = [
  { id: 'm-1', name: 'CNC Machine 01', type: 'CNC', status: 'running', lastActive: '2 min ago', uptime: '99.4%' },
  { id: 'm-2', name: 'Press Machine 02', type: 'Press', status: 'running', lastActive: '4 min ago', uptime: '98.1%' },
  { id: 'm-3', name: 'Assembly Line 03', type: 'Assembly', status: 'stopped', lastActive: '12 min ago', uptime: '84.2%' },
  { id: 'm-4', name: 'Packaging Line 04', type: 'Packaging', status: 'maintenance', lastActive: '1 hr ago', uptime: '91.0%' },
];

const initialInspections: InspectionItem[] = [
  { id: 'ins-1', partId: 'Part #A123', partType: 'Gear Housing', machine: 'CNC Machine 01', timestamp: '2 min ago', duration: '2.4 sec', status: 'PASS', confidence: 98.7, dimensions: 'Within Tolerance' },
  { id: 'ins-2', partId: 'Part #A124', partType: 'Gear Housing', machine: 'CNC Machine 01', timestamp: '10:24 AM', duration: '2.5 sec', status: 'FAIL', confidence: 92.3, defects: ['Scratch 0.92'], dimensions: 'Within Tolerance' },
  { id: 'ins-3', partId: 'Part #B567', partType: 'Turbine Flange', machine: 'Press Machine 02', timestamp: '10:18 AM', duration: '3.1 sec', status: 'UNCERTAIN', confidence: 71.4, defects: ['Surface Pitting 0.68'], dimensions: 'Out of Spec (+0.08mm)' },
  { id: 'ins-4', partId: 'Part #A125', partType: 'Gear Housing', machine: 'Assembly Line 03', timestamp: '10:12 AM', duration: '4.7 sec', status: 'FAIL', confidence: 94.0, defects: ['Crack 0.94'], dimensions: 'Within Tolerance' },
  { id: 'ins-5', partId: 'Part #C690', partType: 'Bearing Collar', machine: 'CNC Machine 01', timestamp: '10:05 AM', duration: '2.8 sec', status: 'PASS', confidence: 98.9, dimensions: 'Within Tolerance' },
  { id: 'ins-6', partId: 'Part #B568', partType: 'Valve Plate', machine: 'Press Machine 02', timestamp: '09:48 AM', duration: '3.6 sec', status: 'UNCERTAIN', confidence: 68.2, defects: ['Rough Edge 0.62'], dimensions: 'Within Tolerance' },
];

const initialAlerts: AlertItem[] = [
  { id: 'alt-1', title: 'Machine Fault', machine: 'CNC Machine 01', timestamp: '10:32 AM', severity: 'critical', description: 'Spindle vibration harmonic exceeded safe threshold' },
  { id: 'alt-2', title: 'High Defect Rate', machine: 'Press Machine 02', timestamp: '09:45 AM', severity: 'warning', description: 'Defect rate reached 7.8% during batch #882' },
  { id: 'alt-3', title: 'Sensor Disconnected', machine: 'Assembly Line 03', timestamp: '08:12 AM', severity: 'critical', description: 'Optical camera sensor 2 signal offline' },
  { id: 'alt-4', title: 'Inspection Uncertain', machine: 'Part #B567', timestamp: '07:56 AM', severity: 'warning', description: 'Edge sharpness below 75% confidence requiring review' },
  { id: 'alt-5', title: 'Maintenance Due', machine: 'Packaging Line 04', timestamp: 'Yesterday', severity: 'info', description: 'Scheduled quarterly lubrication inspection cycle' },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>(() => {
    const saved = localStorage.getItem('defex_machines');
    return saved ? JSON.parse(saved) : initialMachines;
  });

  const [inspections, setInspections] = useState<InspectionItem[]>(() => {
    const saved = localStorage.getItem('defex_inspections');
    return saved ? JSON.parse(saved) : initialInspections;
  });

  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('defex_alerts');
    return saved ? JSON.parse(saved) : initialAlerts;
  });

  useEffect(() => {
    localStorage.setItem('defex_machines', JSON.stringify(machines));
  }, [machines]);

  useEffect(() => {
    localStorage.setItem('defex_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('defex_alerts', JSON.stringify(alerts));
  }, [alerts]);

  const addInspection = (item: InspectionItem) => {
    setInspections((prev) => [item, ...prev]);
  };

  const toggleMachineStatus = (id: string) => {
    setMachines((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = m.status === 'running' ? 'stopped' : m.status === 'stopped' ? 'maintenance' : 'running';
        return { ...m, status: nextStatus, lastActive: 'Just now' };
      })
    );
  };

  const addMachine = (name: string, type: string) => {
    const newMachine: Machine = {
      id: `m-${Date.now()}`,
      name,
      type,
      status: 'running',
      lastActive: 'Just now',
      uptime: '100%',
    };
    setMachines((prev) => [...prev, newMachine]);
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  return (
    <AppContext.Provider
      value={{
        machines,
        inspections,
        alerts,
        addInspection,
        toggleMachineStatus,
        addMachine,
        acknowledgeAlert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
};
