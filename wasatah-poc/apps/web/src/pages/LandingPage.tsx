import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import SEOHead from '../components/SEOHead';

const LandingPage = () => {
  return (
    <>
      <SEOHead />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            {/* Logo with Glow Effect */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mb-6 shadow-glow animate-bounce-gentle">
              <span className="text-3xl">🏛️</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black mb-4 animate-slide-up">
              Wasatah
            </h1>
            <p className="text-xl text-secondary-600 mb-3 font-medium animate-slide-up" style={{animationDelay: '0.1s'}}>
              The Future of Real Estate
            </p>
            <p className="text-base text-secondary-500 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Experience the next generation of property transactions powered by blockchain technology, 
              AI-driven security, and Zero-Knowledge Proofs for unparalleled transparency and trust.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{animationDelay: '0.3s'}}>
              <Link
                to="/login"
                className="btn btn-primary btn-lg px-8 py-3 font-bold shadow-glow"
              >
                <span className="mr-2">🚀</span>
                Start Demo
              </Link>
              <Link
                to="/signup"
                className="btn btn-luxury btn-lg px-8 py-3 font-bold"
              >
                <span className="mr-2">✨</span>
                Create Account
              </Link>
              <Link
                to="/demo-script"
                className="btn btn-outline btn-lg px-8 py-3 font-bold"
              >
                <span className="mr-2">📋</span>
                Demo Guide
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-16">
            <Card className="interactive-card text-center group">
              <CardBody className="p-6">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary-900">Secure Authentication</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  Advanced NAFTA-style digital identity verification with AI-powered security protocols
                </p>
              </CardBody>
            </Card>
            
            <Card className="interactive-card text-center group">
              <CardBody className="p-6">
                <div className="h-16 w-16 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-2xl">🏛️</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary-900">Smart Property Listings</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  Complete ownership history with government-verified deeds and blockchain records
                </p>
              </CardBody>
            </Card>
            
            <Card className="interactive-card text-center group">
              <CardBody className="p-6">
                <div className="h-16 w-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary-900">Transparent Transactions</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">
                  Transparent, immutable transaction records with cryptographic proof
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Role Selection Preview */}
          <Card className="mb-16">
            <CardBody className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-secondary-900">Choose Your Role</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="interactive-card text-center group p-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-secondary-900">Buyer</h3>
                  <p className="text-secondary-600 mb-4 text-sm">Looking to purchase properties</p>
                  <ul className="text-xs text-secondary-500 space-y-1 text-left">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>Browse verified properties</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>Make secure offers</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>Track transaction progress</li>
                  </ul>
                </div>

                <div className="interactive-card text-center group p-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-secondary-900">Seller</h3>
                  <p className="text-secondary-600 mb-4 text-sm">Looking to sell properties</p>
                  <ul className="text-xs text-secondary-500 space-y-1 text-left">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2"></span>List properties securely</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2"></span>Manage offers</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2"></span>Track sales analytics</li>
                  </ul>
                </div>

                <div className="interactive-card text-center group p-6">
                  <div className="h-16 w-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-secondary-900">Broker</h3>
                  <p className="text-secondary-600 mb-4 text-sm">Facilitate real estate deals</p>
                  <ul className="text-xs text-secondary-500 space-y-1 text-left">
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Manage client portfolios</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Facilitate negotiations</li>
                    <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Earn commission rewards</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Demo Info */}
          <Card className="max-w-4xl mx-auto">
            <CardBody className="p-8 text-center">
              <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">About This Demo</h3>
              <p className="text-base text-secondary-600 mb-4 leading-relaxed max-w-2xl mx-auto">
                This is a proof-of-concept demonstration of blockchain-powered real estate transactions. 
                The system simulates NAFTA verification and Zero-Knowledge Proofs for identity verification.
              </p>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 border border-primary-200">
                <p className="text-sm text-primary-800 font-medium">
                  <span className="font-bold">Note:</span> No real cryptography is used - this is for demonstration purposes only.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
