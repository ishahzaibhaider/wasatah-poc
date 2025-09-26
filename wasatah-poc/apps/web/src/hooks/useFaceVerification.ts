import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

interface FaceVerificationState {
  isVerifying: boolean;
  showVerification: boolean;
  verificationResult: 'success' | 'failed' | null;
}

export const useFaceVerification = () => {
  const { user } = useAuthStore();
  const [state, setState] = useState<FaceVerificationState>({
    isVerifying: false,
    showVerification: false,
    verificationResult: null,
  });

  const startVerification = () => {
    setState({
      isVerifying: true,
      showVerification: true,
      verificationResult: null,
    });
  };

  const onVerificationSuccess = () => {
    setState({
      isVerifying: false,
      showVerification: false,
      verificationResult: 'success',
    });
  };

  const onVerificationCancel = () => {
    setState({
      isVerifying: false,
      showVerification: false,
      verificationResult: 'failed',
    });
  };

  const resetVerification = () => {
    setState({
      isVerifying: false,
      showVerification: false,
      verificationResult: null,
    });
  };

  const isUserVerified = user?.kycStatus === 'verified';
  const needsFullKYC = user?.kycStatus === 'not_started' || user?.kycStatus === 'rejected';

  return {
    ...state,
    startVerification,
    onVerificationSuccess,
    onVerificationCancel,
    resetVerification,
    isUserVerified,
    needsFullKYC,
    user,
  };
};
