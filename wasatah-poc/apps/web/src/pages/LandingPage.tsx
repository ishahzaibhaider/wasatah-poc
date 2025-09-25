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
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            {/* Logo with Glow Effect */}
            <div className="mx-auto h-32 w-32 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mb-8 shadow-glow-lg animate-bounce-gentle">
              <span className="text-5xl">🏛️</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black mb-6 animate-slide-up">
              Wasatah
            </h1>
            <p className="text-2xl text-secondary-600 mb-4 font-medium animate-slide-up" style={{animationDelay: '0.1s'}}>
              The Future of Real Estate
            </p>
            <p className="text-lg text-secondary-500 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
              Experience the next generation of property transactions powered by blockchain technology, 
              AI-driven security, and Zero-Knowledge Proofs for unparalleled transparency and trust.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in" style={{animationDelay: '0.3s'}}>
              <Link
                to="/login"
                className="btn btn-primary btn-xl px-12 py-5 text-lg font-bold shadow-glow-lg hover:shadow-glow-lg"
              >
                <span className="mr-2">🚀</span>
                Start Demo
              </Link>
              <Link
                to="/signup"
                className="btn btn-luxury btn-xl px-12 py-5 text-lg font-bold"
              >
                <span className="mr-2">✨</span>
                Create Account
              </Link>
              <Link
                to="/demo-script"
                className="btn btn-outline btn-xl px-12 py-5 text-lg font-bold"
              >
                <span className="mr-2">📋</span>
                Demo Guide
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <Card className="interactive-card text-center group">
              <CardBody className="p-10">
                <div className="h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <span className="text-3xl">🔐</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary-900">Secure Authentication</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Advanced NAFTA-style digital identity verification with AI-powered security protocols and biometric authentication
                </p>
              </CardBody>
            </Card>
            
            <Card className="interactive-card text-center group">
              <CardBody className="p-10">
                <div className="h-20 w-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-3xl">🏛️</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary-900">Smart Property Listings</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Complete ownership history with government-verified deeds and blockchain-immutable property records
                </p>
              </CardBody>
            </Card>
            
            <Card className="interactive-card text-center group">
              <CardBody className="p-10">
                <div className="h-20 w-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-secondary-900">Transparent Transactions</h3>
                <p className="text-secondary-600 leading-relaxed">
                  Transparent, immutable transaction records with cryptographic proof and real-time verification
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Role Selection Preview */}
          <Card className="mb-20">
            <CardBody className="p-12">
              <h2 className="text-4xl font-bold text-center mb-12 text-secondary-900">Choose Your Role</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="interactive-card text-center group p-8">
                  <div className="h-24 w-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                    <span className="text-4xl">🏠</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-secondary-900">Buyer</h3>
                  <p className="text-secondary-600 mb-6 font-medium">Looking to purchase properties</p>
                  <ul className="text-sm text-secondary-500 space-y-2 text-left">
                    <li className="flex items-center"><span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>Browse verified properties</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>Make secure offers</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>Track transaction progress</li>
                  </ul>
                </div>

                <div className="interactive-card text-center group p-8">
                  <div className="h-24 w-24 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <span className="text-4xl">💰</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-secondary-900">Seller</h3>
                  <p className="text-secondary-600 mb-6 font-medium">Looking to sell properties</p>
                  <ul className="text-sm text-secondary-500 space-y-2 text-left">
                    <li className="flex items-center"><span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>List properties securely</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>Manage offers</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>Track sales analytics</li>
                  </ul>
                </div>

                <div className="interactive-card text-center group p-8">
                  <div className="h-24 w-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-secondary-900">Broker</h3>
                  <p className="text-secondary-600 mb-6 font-medium">Facilitate real estate deals</p>
                  <ul className="text-sm text-secondary-500 space-y-2 text-left">
                    <li className="flex items-center"><span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>Manage client portfolios</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>Facilitate negotiations</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-accent-500 rounded-full mr-3"></span>Earn commission rewards</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Demo Info */}
          <Card className="max-w-5xl mx-auto">
            <CardBody className="p-12 text-center">
              <div className="h-20 w-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-3xl font-bold text-secondary-900 mb-6">About This Demo</h3>
              <p className="text-lg text-secondary-600 mb-6 leading-relaxed max-w-3xl mx-auto">
                This is a proof-of-concept demonstration of blockchain-powered real estate transactions. 
                The system simulates NAFTA verification and Zero-Knowledge Proofs for identity verification.
              </p>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
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
