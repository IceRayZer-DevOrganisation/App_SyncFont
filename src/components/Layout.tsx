import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Type, Home, Folder, Search } from 'lucide-react';
import AuthModal from './AuthModal';
import { useUser } from './UserContext';

const Layout: React.FC = () => {
  const { user, loading, logout } = useUser();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Gestion du clic sur les boutons verts
  const handleAuthNav = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      setAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Type className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Font Manager</h1>
                <p className="text-sm text-gray-500">Professional Typography Management</p>
              </div>
            </div>
            <div>
              {loading ? null : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 text-sm">{user.email}</span>
                  <button
                    className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  onClick={() => setAuthOpen(true)}
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-8 mb-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
            end
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </NavLink>
          {/* Font Library */}
          <button
            onClick={() => handleAuthNav('/fonts')}
            className={user
              ? "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#00662E] text-white hover:bg-green-700 transition-colors"
            }
            style={{ minWidth: 120 }}
          >
            <Search className={user ? "h-4 w-4 text-gray-600" : "h-4 w-4 text-white"} />
            <span>Font Library</span>
          </button>
          {/* Collections */}
          <button
            onClick={() => handleAuthNav('/collections')}
            className={user
              ? "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              : "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium bg-[#00662E] text-white hover:bg-green-700 transition-colors"
            }
            style={{ minWidth: 120 }}
          >
            <Folder className={user ? "h-4 w-4 text-gray-600" : "h-4 w-4 text-white"} />
            <span>Collections</span>
          </button>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthSuccess={() => setAuthOpen(false)}
      />
    </div>
  );
};

export default Layout;