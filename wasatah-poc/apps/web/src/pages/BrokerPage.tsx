import { useState } from 'react';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useSecurityStore } from '../stores/useSecurityStore';
import { createPseudoSignature } from '../utils/crypto';
import { isReadonlyMode } from '../utils/api';
import Notification from '../components/Notification';
import { Card, CardBody } from '../components/ui/Card';

const BrokerPage = () => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState('');
  const [selectedSeller, setSelectedSeller] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const { addEvent } = useLedgerStore();
  const { evaluateImpersonation } = useSecurityStore();

  const mockBuyers = [
    { id: 'buyer_001', name: 'Sarah Al-Mansouri', email: 'sarah@example.com', kycStatus: 'verified' as const },
    { id: 'buyer_002', name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', kycStatus: 'verified' as const },
    { id: 'buyer_003', name: 'Fatima Al-Zahra', email: 'fatima@example.com', kycStatus: 'pending_review' as const }
  ];

  const mockSellers = [
    { id: 'seller_001', name: 'Khalid Al-Sabah', email: 'khalid@example.com', kycStatus: 'verified' as const },
    { id: 'seller_002', name: 'Noura Al-Mutairi', email: 'noura@example.com', kycStatus: 'verified' as const },
    { id: 'seller_003', name: 'Omar Al-Ghamdi', email: 'omar@example.com', kycStatus: 'not_started' as const }
  ];

  const mockProperties = [
    { id: 'prop_001', title: 'Luxury Villa - Riyadh', price: 2800000, image: './images/properties/luxury-villa-riyadh.jpg' },
    { id: 'prop_002', title: 'Modern Apartment - Jeddah', price: 1800000, image: './images/properties/modern-apartment.jpg' },
    { id: 'prop_003', title: 'Townhouse - Dammam', price: 1200000, image: './images/properties/townhouse-dammam.jpg' }
  ];

  const handleLinkBuyerSeller = async () => {
    if (!selectedBuyer || !selectedSeller || !selectedProperty) {
      setNotification({
        message: 'Please select buyer, seller, and property',
        type: 'error',
        isVisible: true
      });
      return;
    }

    setIsLinking(true);
    
    try {
      const buyer = mockBuyers.find(b => b.id === selectedBuyer);
      const seller = mockSellers.find(s => s.id === selectedSeller);
      const property = mockProperties.find(p => p.id === selectedProperty);

      await addEvent('buyer_broker_linked', 'broker_001', 'Current Broker', {
        buyerId: selectedBuyer,
        sellerId: selectedSeller,
        propertyId: selectedProperty,
        buyerName: buyer?.name,
        sellerName: seller?.name,
        propertyTitle: property?.title,
        linkedAt: new Date().toISOString()
      });

      setNotification({
        message: 'Buyer and Seller successfully linked! 🔗',
        type: 'success',
        isVisible: true
      });

      setShowLinkModal(false);
      setSelectedBuyer('');
      setSelectedSeller('');
      setSelectedProperty('');
    } catch (error) {
      console.error('Failed to link buyer and seller:', error);
      setNotification({
        message: 'Failed to link buyer and seller. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setIsLinking(false);
    }
  };

  const handleTestImpersonation = async () => {
    const testUser = {
      id: 'test_user_001',
      email: 'sarah@example.com', // This will trigger duplicate email rule
      name: 'Test User',
      phone: '+966501234567', // This will trigger duplicate phone rule
      role: 'broker' as const,
      digitalId: {
        id: 'digital_001', // This will trigger duplicate DigitalID rule
        userId: 'test_user_001',
        verified: true,
        verificationMethod: 'NAFTA_SIM' as const,
        issuedAt: new Date().toISOString(),
        riskScore: 25
      },
      createdAt: new Date().toISOString(),
      isActive: true
    };

    try {
      const riskFlags = await evaluateImpersonation(testUser, { page: 'broker' });
      
      setNotification({
        message: `Impersonation evaluation completed. Found ${riskFlags.length} risk flag(s).`,
        type: riskFlags.length > 0 ? 'error' : 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to evaluate impersonation:', error);
      setNotification({
        message: 'Failed to evaluate impersonation. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleCompleteTransaction = async (connectionId: string, buyerId: string, sellerId: string, propertyId: string, amount: number) => {
    try {
      const transactionPayload = {
        connectionId,
        buyerId,
        sellerId,
        propertyId,
        amount,
        completedAt: new Date().toISOString(),
        brokerId: 'broker_001'
      };

      const signature = createPseudoSignature(transactionPayload);

      await addEvent('transfer_completed', 'broker_001', 'Current Broker', {
        ...transactionPayload,
        signature,
        transactionHash: `tx_${Date.now()}`,
        status: 'completed'
      });

      setNotification({
        message: 'Transaction completed successfully! 🎉',
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error('Failed to complete transaction:', error);
      setNotification({
        message: 'Failed to complete transaction. Please try again.',
        type: 'error',
        isVisible: true
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black mb-3">Broker Dashboard</h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
            Connect buyers and sellers in the Wasatah network with AI-powered security
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!isReadonlyMode() && (
            <button
              onClick={handleTestImpersonation}
              className="btn btn-outline px-6 py-3 font-bold"
            >
              <span className="mr-2">🛡️</span>
              Test Security
            </button>
          )}
          {!isReadonlyMode() && (
            <button
              onClick={() => setShowLinkModal(true)}
              className="btn btn-primary px-6 py-3 font-bold shadow-glow"
            >
              <span className="mr-2">🔗</span>
              Link Buyer & Seller
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Connections */}
        <Card className="h-fit">
          <CardBody className="p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3 shadow-glow">
                <span className="text-lg">🔗</span>
              </div>
              <h2 className="text-xl font-bold text-secondary-900">Active Connections</h2>
            </div>
            
          <div className="space-y-4">
              <div className="interactive-card p-4 group">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/properties/luxury-villa-riyadh.jpg" 
                      alt="Luxury Villa - Riyadh" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-secondary-900">Luxury Villa - Riyadh</h3>
                <div className="flex items-center space-x-2">
                        <span className="badge badge-success">Active</span>
                        <span className="badge badge-primary">🔐 ZKP Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-secondary-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                    <span className="font-medium">Seller:</span>
                    <span className="ml-2">Ahmed Al-Rashid</span>
                  </div>
                  <div className="flex items-center text-secondary-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2"></span>
                    <span className="font-medium">Buyer:</span>
                    <span className="ml-2">Sarah Al-Mansouri</span>
                  </div>
                  <div className="flex items-center text-secondary-600 text-sm">
                    <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>
                    <span className="font-medium">Offer:</span>
                    <span className="ml-2 font-bold text-secondary-900">SAR 2,500,000</span>
              </div>
              </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm text-xs px-3 py-1">
                  Facilitate Meeting
                </button>
                {!isReadonlyMode() && (
                  <button 
                    onClick={() => handleCompleteTransaction('conn_001', 'buyer_001', 'seller_001', 'prop_001', 2500000)}
                      className="btn btn-success btn-sm text-xs px-3 py-1"
                  >
                    Complete Transaction
                  </button>
                )}
              </div>
            </div>
            
            {/* Success state example */}
              <div className="interactive-card p-4 bg-gradient-to-r from-success-50/50 to-success-100/50 border-success-200/50">
                <div className="flex items-start space-x-4 mb-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/properties/modern-apartment.jpg" 
                      alt="Modern Apartment - Jeddah" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-success-800">Modern Apartment - Jeddah</h3>
                <div className="flex items-center space-x-2">
                        <span className="badge badge-success">Linked Successfully</span>
                        <span className="badge badge-primary">🔐 ZKP Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-success-700">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>
                    <span className="font-medium">Seller:</span>
                    <span className="ml-2">Noura Al-Mutairi</span>
                  </div>
                  <div className="flex items-center text-success-700">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>
                    <span className="font-medium">Buyer:</span>
                    <span className="ml-2">Fatima Al-Zahra</span>
                  </div>
                  <div className="flex items-center text-success-700">
                    <span className="w-2 h-2 bg-success-500 rounded-full mr-3"></span>
                    <span className="font-medium">Property:</span>
                    <span className="ml-2">Modern Apartment - Jeddah</span>
                  </div>
                </div>
                <div className="bg-success-100 rounded-lg p-3 border border-success-200">
                  <p className="text-sm text-success-800 font-medium flex items-center">
                    <span className="mr-2">✅</span>
                    buyer_broker_linked event created
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Available Properties */}
        <Card className="h-fit">
          <CardBody className="p-8">
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <span className="text-2xl">🏘️</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Available Properties</h2>
            </div>
            
            <div className="space-y-6">
              <div className="interactive-card p-4 group">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="/images/properties/modern-apartment.jpg" 
                      alt="Modern Apartment - Jeddah" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-secondary-900 mb-3">Modern Apartment - Jeddah</h3>
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center text-secondary-600 text-sm">
                        <span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>
                        <span className="font-medium">Price:</span>
                        <span className="ml-2 font-bold text-secondary-900">SAR 1,800,000</span>
                      </div>
                      <div className="flex items-center text-secondary-600 text-sm">
                        <span className="w-1.5 h-1.5 bg-success-500 rounded-full mr-2"></span>
                        <span className="font-medium">Status:</span>
                        <span className="ml-2">Available</span>
                      </div>
                      <div className="flex items-center text-secondary-600 text-sm">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></span>
                        <span className="font-medium">Seller:</span>
                        <span className="ml-2">Fatima Al-Zahra</span>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm">
                  Connect Buyers
                </button>
              </div>
            </div>
              </div>
              
              {/* Empty state for more properties */}
              <div className="interactive-card p-6 border-2 border-dashed border-secondary-200 text-center group hover:border-primary-300 transition-colors">
                <div className="h-16 w-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-300">
                  <span className="text-2xl text-secondary-400 group-hover:text-primary-500">➕</span>
            </div>
                <h3 className="text-lg font-bold text-secondary-600 mb-2">More Properties Coming Soon</h3>
                <p className="text-sm text-secondary-500">Additional properties will appear here as they become available</p>
          </div>
        </div>
          </CardBody>
        </Card>
      </div>

      {/* Broker Stats */}
      <Card className="mt-8">
        <CardBody className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Broker Statistics</h2>
            <p className="text-secondary-600 text-sm">Your performance metrics and achievements</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <span className="text-lg text-white">🔗</span>
              </div>
              <div className="text-2xl font-black text-primary-600 mb-1">12</div>
              <div className="text-xs font-semibold text-secondary-600">Active Connections</div>
          </div>
            
            <div className="text-center group">
              <div className="h-12 w-12 bg-gradient-to-br from-success-500 to-success-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-lg text-white">✅</span>
          </div>
              <div className="text-2xl font-black text-success-600 mb-1">8</div>
              <div className="text-xs font-semibold text-secondary-600">Completed Deals</div>
          </div>
            
            <div className="text-center group">
              <div className="h-12 w-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-lg text-white">💰</span>
        </div>
              <div className="text-2xl font-black text-accent-600 mb-1">SAR 45M</div>
              <div className="text-xs font-semibold text-secondary-600">Total Volume</div>
      </div>
            
            <div className="text-center group">
              <div className="h-12 w-12 bg-gradient-to-br from-luxury-500 to-luxury-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:shadow-glow transition-all duration-300">
                <span className="text-lg text-white">⭐</span>
              </div>
              <div className="text-2xl font-black text-luxury-600 mb-1">4.8</div>
              <div className="text-xs font-semibold text-secondary-600">Rating</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Link Buyer & Seller Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg animate-scale-in">
            <CardBody className="p-8">
              <div className="text-center mb-6">
                <div className="h-16 w-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <span className="text-3xl">🔗</span>
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-2">Link Buyer & Seller</h3>
                <p className="text-secondary-600">Connect parties for a property transaction</p>
              </div>
            
              <div className="space-y-6">
              <div>
                  <label className="form-label">
                  Select Buyer
                </label>
                <select
                  value={selectedBuyer}
                  onChange={(e) => setSelectedBuyer(e.target.value)}
                    className="form-input"
                >
                  <option value="">Choose a buyer...</option>
                  {mockBuyers.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name} ({buyer.email}) - {
                        buyer.kycStatus === 'verified' ? '✅ Verified' : 
                        buyer.kycStatus === 'pending_review' ? '⏳ Under Review' : 
                        buyer.kycStatus === 'not_started' ? '🔒 Not Verified' :
                        '🔒 Not Verified'
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                  <label className="form-label">
                  Select Seller
                </label>
                <select
                  value={selectedSeller}
                  onChange={(e) => setSelectedSeller(e.target.value)}
                    className="form-input"
                >
                  <option value="">Choose a seller...</option>
                  {mockSellers.map((seller) => (
                    <option key={seller.id} value={seller.id}>
                      {seller.name} ({seller.email}) - {
                        seller.kycStatus === 'verified' ? '✅ Verified' : 
                        seller.kycStatus === 'pending_review' ? '⏳ Under Review' : 
                        seller.kycStatus === 'not_started' ? '🔒 Not Verified' :
                        '🔒 Not Verified'
                      }
                    </option>
                  ))}
                </select>
              </div>

              <div>
                  <label className="form-label">
                  Select Property
                </label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                    className="form-input"
                >
                  <option value="">Choose a property...</option>
                  {mockProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.title} - SAR {property.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowLinkModal(false)}
                  className="btn btn-ghost flex-1"
                disabled={isLinking}
              >
                Cancel
              </button>
              <button
                onClick={handleLinkBuyerSeller}
                disabled={isLinking || !selectedBuyer || !selectedSeller || !selectedProperty}
                  className="btn btn-primary flex-1"
              >
                {isLinking ? (
                  <>
                      <div className="loading-spinner h-4 w-4 mr-2"></div>
                    <span>Linking...</span>
                  </>
                ) : (
                  <>
                      <span className="mr-2">🔗</span>
                    <span>Link & Create Event</span>
                  </>
                )}
              </button>
            </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

export default BrokerPage;
