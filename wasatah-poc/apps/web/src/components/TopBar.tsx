import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { isReadonlyMode } from '../utils/api';
import ResetDemoButton from './ResetDemoButton';
import VerificationBadge from './VerificationBadge';

const TopBar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-luxury border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-black text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text hover:from-primary-700 hover:to-primary-900 transition-all duration-300 flex items-center group">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg mr-2 shadow-glow group-hover:shadow-glow-lg transition-all duration-300 overflow-hidden">
                <img src="/images/wasatah-logo.png" alt="Wasatah Logo" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Wasatah</span>
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
                <VerificationBadge kycStatus={user?.kycStatus} size="sm" />
                {user?.kycStatus !== 'verified' && (
                  <Link
                    to="/kyc"
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                  >
                    Complete KYC
                  </Link>
                )}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/login')
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    🔐 Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/signup')
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    ✨ Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {/* User Info */}
                  {user && (
                    <div className="px-4 py-3 border-b border-gray-200 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-sm text-white font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <VerificationBadge kycStatus={user.kycStatus} size="sm" />
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Links */}
                  <Link
                    to="/role"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/role') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    🏠 Dashboard
                  </Link>
                  <Link
                    to="/buyer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/buyer') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    👤 Buyer
                  </Link>
                  <Link
                    to="/seller"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/seller') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    🏘️ Seller
                  </Link>
                  <Link
                    to="/broker"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive('/broker') 
                        ? 'bg-primary-600 text-white' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    🤝 Broker
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-300 text-left"
                  >
                    🚪 Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
