import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import { useRoleStore } from '../stores/useRoleStore';
import { useAuthStore } from '../stores/useAuthStore';
import VerificationBadge from '../components/VerificationBadge';

const RolePage = () => {
  const navigate = useNavigate();
  const { selectRole } = useRoleStore();
  const { user } = useAuthStore();

  // Redirect to KYC if user is not verified
  useEffect(() => {
    if (user && user.kycStatus !== 'verified') {
      navigate('/kyc');
    }
  }, [user, navigate]);

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Browse properties, make offers, and track your real estate journey',
      icon: '🏠',
      path: '/buyer',
      color: 'from-blue-500 to-blue-600',
      features: ['Property Search', 'Offer Management', 'Transaction Tracking']
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'List your properties, manage offers, and complete sales',
      icon: '🏘️',
      path: '/seller',
      color: 'from-green-500 to-green-600',
      features: ['Property Listing', 'Offer Review', 'Sale Management']
    },
    {
      id: 'broker',
      title: 'Broker',
      description: 'Connect buyers and sellers, facilitate transactions',
      icon: '🤝',
      path: '/broker',
      color: 'from-purple-500 to-purple-600',
      features: ['Client Matching', 'Transaction Facilitation', 'Commission Tracking']
    }
  ];

  const handleRoleSelect = (roleId: string, path: string) => {
    // Check if user is verified before allowing role selection
    if (user?.kycStatus !== 'verified') {
      navigate('/kyc');
      return;
    }
    
    selectRole(roleId as 'buyer' | 'seller' | 'broker');
    navigate(path);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-4">Choose Your Role</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
          Select how you want to experience the future of real estate transactions
        </p>
        
        {/* User Status */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </div>
          <VerificationBadge kycStatus={user?.kycStatus} />
          {user?.kycStatus !== 'verified' && (
            <button
              onClick={() => navigate('/kyc')}
              className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
            >
              Complete KYC
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-primary-50/80 to-accent-50/80 border-primary-200/50 backdrop-blur-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow">
                    <span className="text-lg text-white font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-secondary-900">{user.name}</h3>
                    <p className="text-secondary-600 font-medium text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {user.digitalId && (
                    <>
                      <span className="badge badge-success">
                        ✅ NAFTA Verified
                      </span>
                      <span className="badge badge-primary">
                        🔐 ZKP Verified
                      </span>
                    </>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card
            key={role.id}
            onClick={() => handleRoleSelect(role.id, role.path)}
            className="interactive-card text-center group cursor-pointer animate-fade-in"
          >
            <CardBody className="p-8">
              {/* Icon with gradient background */}
              <div className={`mx-auto h-16 w-16 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110`}>
                <span className="text-2xl">{role.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-secondary-900">{role.title}</h3>
              <p className="text-secondary-600 mb-6 leading-relaxed text-sm">{role.description}</p>
              
              {/* Features */}
              <div className="space-y-2 mb-6">
                {role.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center justify-center text-xs text-secondary-500">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    {feature}
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              <button className={`w-full py-3 px-6 bg-gradient-to-r ${role.color} text-white font-bold rounded-lg shadow-lg hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105`}>
                Enter as {role.title}
              </button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-20">
        <Card className="bg-gradient-to-r from-secondary-50/80 to-primary-50/80 border-secondary-200/50 backdrop-blur-sm">
          <CardBody className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-8 text-secondary-900">Why Choose Wasatah?</h3>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-2xl">🔒</span>
                </div>
                <h4 className="text-lg font-bold text-secondary-900 mb-2">Blockchain Security</h4>
                <p className="text-secondary-600 text-sm">Immutable transaction records</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-lg font-bold text-secondary-900 mb-2">AI-Powered Insights</h4>
                <p className="text-secondary-600 text-sm">Smart fraud detection</p>
              </div>
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-lg font-bold text-secondary-900 mb-2">Instant Transactions</h4>
                <p className="text-secondary-600 text-sm">Real-time processing</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RolePage;
