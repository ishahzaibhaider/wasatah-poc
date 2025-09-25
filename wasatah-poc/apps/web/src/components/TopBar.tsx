import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { isReadonlyMode } from '../utils/api';
import ResetDemoButton from './ResetDemoButton';

const TopBar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-luxury border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text hover:from-primary-700 hover:to-primary-900 transition-all duration-300 flex items-center group">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mr-2 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <span className="text-lg">🏛️</span>
              </div>
              Wasatah
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/signup')
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/role"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/role') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/buyer"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/buyer') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  👤 Buyer
                </Link>
                <Link
                  to="/seller"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/seller') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  🏘️ Seller
                </Link>
                <Link
                  to="/broker"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/broker') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  🤝 Broker
                </Link>
                <Link
                  to="/explorer"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/explorer') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  ⛓️ Explorer
                </Link>
                <Link
                  to="/about-zk"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/about-zk') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  🔐 About ZK
                </Link>
                <Link
                  to="/demo-script"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive('/demo-script') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  📋 Demo
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-secondary-600">
                  Welcome, <span className="font-semibold text-secondary-900">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-ghost btn-sm"
                >
                  Logout
                </button>
              </div>
            )}
            {!isReadonlyMode() && isAuthenticated && (
              <ResetDemoButton />
            )}
            {isReadonlyMode() && (
              <div className="px-3 py-1 bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 text-xs font-semibold rounded-full border border-warning-200">
                📖 Read-Only Mode
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t border-secondary-100/50 bg-white/50 backdrop-blur-sm">
          <nav className="flex items-center justify-around py-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  🔐 Sign In
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive('/signup')
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  ✨ Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/role"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    isActive('/role') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  🏠 Dashboard
                </Link>
                <Link
                  to="/buyer"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    isActive('/buyer') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  👤 Buyer
                </Link>
                <Link
                  to="/seller"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    isActive('/seller') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  🏘️ Seller
                </Link>
                <Link
                  to="/broker"
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    isActive('/broker') 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-glow' 
                      : 'text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  🤝 Broker
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
