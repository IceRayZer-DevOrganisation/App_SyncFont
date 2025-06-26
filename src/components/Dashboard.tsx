import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Folder, Search, Type, Shield, Clock } from 'lucide-react';
import { getFonts } from '../services/fontService';
import { getCollections } from '../services/supabaseService';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import AuthModal from './AuthModal';

const Dashboard: React.FC = () => {
  const [fonts, setFonts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getFonts().then(setFonts);
      getCollections().then(setCollections);
    }
    setLastScan(null); // À adapter si tu veux gérer un vrai scan
  }, [user]);

  // Statistiques simplifiées
  const totalFonts = fonts.length;
  const totalCollections = collections.length;
  const byCategory = fonts.reduce((acc, font) => {
    acc[font.category] = (acc[font.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const byLicense = fonts.reduce((acc, font) => {
    acc[font.license] = (acc[font.license] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentlyAdded = fonts.filter(font => new Date(font.dateInstalled) > thirtyDaysAgo).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Manage your typography collection</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {}}
            disabled={true}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-300 text-white rounded-lg opacity-50 cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Scan Fonts</span>
          </button>
          <button
            onClick={() => user ? navigate('/collections') : setAuthOpen(true)}
            className={user
              ? "flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              : "flex items-center space-x-2 px-4 py-2 rounded-lg focus:outline-none w-full bg-[#00662E] text-white hover:bg-green-700 transition-colors"
            }
          >
            <Plus className="h-4 w-4" />
            <span>New Collection</span>
          </button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fonts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalFonts}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Type className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Collections</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalCollections}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Folder className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Free Fonts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{byLicense.free || 0}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recently Added</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{recentlyAdded}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Categories Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Font Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.entries(byCategory) as [string, number][]).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600 capitalize mt-1">{category.replace('-', ' ')}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => user ? navigate('/fonts') : setAuthOpen(true)}
              className={user
                ? "w-full flex items-center space-x-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                : "w-full flex items-center space-x-3 p-3 text-left rounded-lg bg-[#00662E] text-white hover:bg-green-700 transition-colors"
              }
            >
              <Search className={user ? "h-5 w-5 text-gray-600" : "h-5 w-5 text-white"} />
              <div>
                <p className="font-medium" style={user ? { color: '#111' } : { color: '#fff' }}>Browse Font Library</p>
                <p className={user ? "text-sm text-gray-600" : "text-sm text-white/80"}>Explore all installed fonts</p>
              </div>
            </button>
            <button
              onClick={() => user ? navigate('/collections') : setAuthOpen(true)}
              className={user
                ? "w-full flex items-center space-x-3 p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                : "w-full flex items-center space-x-3 p-3 text-left rounded-lg bg-[#00662E] text-white hover:bg-green-700 transition-colors"
              }
            >
              <Folder className={user ? "h-5 w-5 text-gray-600" : "h-5 w-5 text-white"} />
              <div>
                <p className="font-medium" style={user ? { color: '#111' } : { color: '#fff' }}>Manage Collections</p>
                <p className={user ? "text-sm text-gray-600" : "text-sm text-white/80"}>Organize fonts by project</p>
              </div>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Scan</span>
              <span className="text-sm text-gray-900">
                {lastScan ? formatDate(lastScan) : 'Never'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">License Status</span>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {byLicense.free || 0} Free
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {byLicense.commercial || 0} Commercial
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  {byLicense.unknown || 0} Unknown
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => setAuthOpen(false)}
      />
    </div>
  );
};

export default Dashboard;