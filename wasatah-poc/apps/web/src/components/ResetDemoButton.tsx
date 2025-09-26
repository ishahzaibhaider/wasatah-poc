import { useState } from 'react';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useOfferStore } from '../stores/useOfferStore';
import { useSecurityStore } from '../stores/useSecurityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useRoleStore } from '../stores/useRoleStore';
import { clearAllStoredData } from '../utils/browserStorage';

const ResetDemoButton = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { resetLedger } = useLedgerStore();
  const { clearOffers } = useOfferStore();
  const { clearRiskFlags } = useSecurityStore();
  const { logout } = useAuthStore();
  const { clearRole } = useRoleStore();

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset the demo? This will clear all data and return to the initial state.')) {
      return;
    }

    setIsResetting(true);
    
    try {
      // Clear all browser storage data
      clearAllStoredData();
      
      // Reset all stores to initial state
      await resetLedger();
      clearOffers();
      clearRiskFlags();
      clearRole();
      
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

  // Always show reset button since we're now using browser storage

  return (
    <button
      onClick={handleResetDemo}
      disabled={isResetting}
      className="px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
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
