import { useState } from 'react';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useSecurityStore } from '../stores/useSecurityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useRoleStore } from '../stores/useRoleStore';
import { isReadonlyMode } from '../utils/api';

const ResetDemoButton = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { resetLedger } = useLedgerStore();
  const { clearOffers } = useOfferStore();
  const { clearRiskFlags } = useSecurityStore();
  const { logout } = useAuthStore();
  const { clearRole } = useRoleStore();

  const handleResetDemo = async () => {
    if (isReadonlyMode()) {
      alert('Demo reset is not available in read-only mode.');
      return;
    }

    if (!confirm('Are you sure you want to reset the demo? This will clear all data and return to the initial state.')) {
      return;
    }

    setIsResetting(true);
    
    try {
      // Reset all stores to initial state
      await resetLedger();
      clearOffers();
      clearRiskFlags();
      clearRole();
      
      // Clear localStorage
      localStorage.removeItem('wasatah-auth');
      localStorage.removeItem('wasatah-role');
      localStorage.removeItem('wasatah-offers');
      localStorage.removeItem('wasatah-security');
      localStorage.removeItem('wasatah-ledger');
      
      // Logout user
      logout();
      
      // Reload page to start fresh
      window.location.href = '/';
      
    } catch (error) {
      console.error('Failed to reset demo:', error);
      alert('Failed to reset demo. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  if (isReadonlyMode()) {
    return null;
  }

  return (
    <button
      onClick={handleResetDemo}
      disabled={isResetting}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
    >
      {isResetting ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Resetting...</span>
        </>
      ) : (
        <>
          <span>🔄</span>
          <span>Reset Demo</span>
        </>
      )}
    </button>
  );
};

export default ResetDemoButton;
