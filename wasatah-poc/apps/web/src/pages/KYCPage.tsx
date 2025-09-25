import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useKYCStore } from '../stores/useKYCStore';
import KYCFlow from '../components/kyc/KYCFlow';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button, Badge } from '../components/ui';
import { useEffect } from 'react';

const KYCPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { kycData, clearKYC } = useKYCStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleKYCComplete = () => {
    // Navigate to role selection or dashboard
    navigate('/role');
  };

  const handleKYCCancel = () => {
    clearKYC();
    navigate('/role');
  };

  const handleStartKYC = () => {
    // KYC will be started automatically in KYCFlow component
  };

  if (!isAuthenticated) {
    return null;
  }

  // If KYC is already in progress or completed, show the flow
  if (kycData) {
    return <KYCFlow onComplete={handleKYCComplete} onCancel={handleKYCCancel} />;
  }

  // Show KYC introduction page
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Identity Verification (KYC)
              </h1>
              <p className="text-lg text-gray-600">
                Complete your identity verification to access all platform features
              </p>
            </CardHeader>
            <CardBody>
              <div className="space-y-8">
                {/* Benefits Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-blue-900 mb-4">
                    🏆 Benefits of Verification
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✅</span>
                      <div>
                        <h3 className="font-medium text-blue-900">Verified Badge</h3>
                        <p className="text-blue-700 text-sm">Show your verified status to other users</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <h3 className="font-medium text-blue-900">Enhanced Security</h3>
                        <p className="text-blue-700 text-sm">Protect against identity fraud and impersonation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <h3 className="font-medium text-blue-900">Faster Transactions</h3>
                        <p className="text-blue-700 text-sm">Streamlined property transactions and offers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🤝</span>
                      <div>
                        <h3 className="font-medium text-blue-900">Trust Building</h3>
                        <p className="text-blue-700 text-sm">Build trust with sellers, buyers, and brokers</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Process Overview */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    📋 Verification Process
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Personal Info</h3>
                      <p className="text-gray-600 text-sm">Provide your legal name, address, and contact details</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                      <p className="text-gray-600 text-sm">Upload your ID and proof of address documents</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📱</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Face Check</h3>
                      <p className="text-gray-600 text-sm">Complete a quick liveness check with your camera</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Verification</h3>
                      <p className="text-gray-600 text-sm">Get your verified badge and full access</p>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    🔐 Security & Privacy
                  </h3>
                  <ul className="text-green-800 text-sm space-y-1">
                    <li>• All data is encrypted and stored securely</li>
                    <li>• Documents are processed using advanced AI verification</li>
                    <li>• Your information is never shared with third parties</li>
                    <li>• You can request data deletion at any time</li>
                  </ul>
                </div>

                {/* User Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Account</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                      <p className="text-gray-600 text-sm">Role: {user?.role}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">Not Verified</Badge>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 pt-6">
                  <Button
                    onClick={handleStartKYC}
                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    Start Verification Process
                  </Button>
                  <Button
                    onClick={() => navigate('/role')}
                    variant="outline"
                    className="px-8 py-3"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
