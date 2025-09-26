import { useState, useEffect } from 'react';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { useOfferStore } from '../stores/useOfferStore';
import { useLedgerStore } from '../stores/useLedgerStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useFaceVerification } from '../hooks/useFaceVerification';
import FaceVerification from '../components/kyc/FaceVerification';
import { getStoredProperties, getStoredOffersByProperty, saveStoredOffer } from '../utils/browserStorage';
import VerificationBadge from '../components/VerificationBadge';
import Notification from '../components/Notification';

const SellerPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });
  
  const { 
    updateOfferStatus, 
    loadOffers, 
    isLoading: offersLoading 
  } = useOfferStore();

  const { addEvent } = useLedgerStore();
  const { user } = useAuthStore();
  const {
    showVerification,
    startVerification,
    onVerificationSuccess,
    onVerificationCancel,
    resetVerification,
    isUserVerified,
  } = useFaceVerification();
  
  // Get the featured property from browser storage
  const properties = getStoredProperties();
  const property = properties[0]; // Get the first property

  // Load offers on component mount and add dummy offers if none exist
  useEffect(() => {
    loadOffers();
    
    // Add some dummy offers if none exist
    const existingOffers = getStoredOffersByProperty(property.id);
    if (existingOffers.length === 0) {
      const dummyOffers = [
        {
          id: `offer_dummy_1_${Date.now()}`,
          propertyId: property.id,
          buyerId: 'dummy_buyer_1',
          buyerName: 'Sarah Al-Mansouri',
          amount: 2500000,
          status: 'pending' as const,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        },
        {
          id: `offer_dummy_2_${Date.now()}`,
          propertyId: property.id,
          buyerId: 'dummy_buyer_2',
          buyerName: 'Khalid Al-Rashid',
          amount: 2300000,
          status: 'pending' as const,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
        }
      ];
      
      dummyOffers.forEach(offer => saveStoredOffer(offer));
    }
  }, [loadOffers, property.id]);

  // Get offers for this property from browser storage
  const propertyOffers = getStoredOffersByProperty(property.id);

  // Use the ownership history from the property data
  const ownershipHistory = property.ownershipHistory;

  const handleOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    // Check if user needs face verification
    if (!isUserVerified) {
      setNotification({
        message: 'Please complete KYC verification before managing offers.',
        type: 'error',
        isVisible: true
      });
      return;
    }
    
    // Store the action for after verification
    setPendingAction({ offerId, action });
    startVerification();
  };

  const [pendingAction, setPendingAction] = useState<{ offerId: string; action: 'accept' | 'decline' } | null>(null);

  const executeOfferAction = async (offerId: string, action: 'accept' | 'decline') => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      await updateOfferStatus(offerId, status);
      
      // Find the offer to get details
      const offer = propertyOffers.find(o => o.id === offerId);
      
      // Add ledger event for offer response
      const eventType = action === 'accept' ? 'offer_accepted' : 'offer_rejected';
      await addEvent(eventType, user?.id || 'seller', user?.name || 'Property Seller', {
        offerId: offerId,
        propertyId: property.id,
        buyerId: offer?.buyerId,
        buyerName: offer?.buyerName,
        amount: offer?.amount,
        action: action,
        respondedAt: new Date().toISOString()
      });
      
      setNotification({
        message: `Offer ${action}ed successfully!`,
        type: 'success',
        isVisible: true
      });
    } catch (error) {
      console.error(`Failed to ${action} offer:`, error);
      setNotification({
        message: `Failed to ${action} offer. Please try again.`,
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleVerificationSuccess = () => {
    onVerificationSuccess();
    if (pendingAction) {
      executeOfferAction(pendingAction.offerId, pendingAction.action);
      setPendingAction(null);
    }
    resetVerification();
  };

  const handleEditProperty = () => {
    setIsEditing(true);
  };

  const handleCompleteTransaction = async (offerId: string, buyerId: string, amount: number) => {
    // Check if user needs face verification
    if (!isUserVerified) {
      setNotification({
        message: 'Please complete KYC verification before completing transactions.',
        type: 'error',
        isVisible: true
      });
      return;
    }
    
    // Store the transaction details for after verification
    setPendingTransaction({ offerId, buyerId, amount });
    startVerification();
  };

  const [pendingTransaction, setPendingTransaction] = useState<{ offerId: string; buyerId: string; amount: number } | null>(null);

  const executeTransaction = async (offerId: string, buyerId: string, amount: number) => {
    try {
      const transactionPayload = {
        offerId,
        buyerId,
        sellerId: user?.id || 'seller',
        propertyId: property.id,
        amount,
        completedAt: new Date().toISOString(),
        sellerName: user?.name || 'Property Seller'
      };

      // Add ledger event for transaction completion
      await addEvent('transfer_completed', user?.id || 'seller', user?.name || 'Property Seller', {
        ...transactionPayload,
        signature: `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

  const handleTransactionVerificationSuccess = () => {
    onVerificationSuccess();
    if (pendingTransaction) {
      executeTransaction(pendingTransaction.offerId, pendingTransaction.buyerId, pendingTransaction.amount);
      setPendingTransaction(null);
    }
    resetVerification();
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Seller Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and track offers</p>
          </div>
          <div className="flex items-center space-x-4">
            {isUserVerified ? (
              <Badge variant="success" className="text-sm">
                🏆 Verified User
              </Badge>
            ) : (
              <Badge variant="warning" className="text-sm">
                ⚠️ KYC Required
              </Badge>
            )}
            <Badge variant="success" className="text-sm">
              ✅ Deed Verified
            </Badge>
            <button 
              onClick={() => navigate('/explorer')}
              className="btn btn-secondary"
            >
              🔍 Open Explorer
            </button>
            <button 
              onClick={handleEditProperty}
              className="btn btn-primary"
            >
              📝 Edit Property
            </button>
          </div>
        </div>
      </div>

      {/* Role Checklist */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardBody className="p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">🏘️ Seller Role Capabilities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  List and manage property listings
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Review and respond to offers
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Track ownership history and deed verification
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Access blockchain property records
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Manage transaction documentation
                </div>
                <div className="flex items-center text-sm text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  View property analytics and insights
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h2>
                  <p className="text-gray-600 mb-4">{property.address}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>🏠 {property.area} sqm</span>
                    <span>🛏️ {property.bedrooms} beds</span>
                    <span>🚿 {property.bathrooms} baths</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {property.currency} {property.price.toLocaleString()}
                  </div>
                  <Badge variant="success" className="mt-2">
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Property Images */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {property.images.map((image: string, index: number) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Ownership History */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Ownership History</h3>
                <div className="space-y-3">
                  {ownershipHistory.map((owner: typeof ownershipHistory[0], index: number) => {
                    const fromDate = new Date(owner.fromDate).toLocaleDateString();
                    const toDate = owner.toDate ? new Date(owner.toDate).toLocaleDateString() : 'Present';
                    const isCurrentOwner = !owner.toDate;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold">
                              {owner.ownerName.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{owner.ownerName}</div>
                            <div className="text-sm text-gray-500">{fromDate} - {toDate}</div>
                            <div className="text-xs text-gray-400 capitalize">{owner.transferType}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={owner.deedVerified ? 'success' : 'warning'}>
                            {owner.deedVerified ? '✅ Deed Verified' : '⏳ Pending'}
                          </Badge>
                          <div className="text-sm text-gray-500 mt-1">
                            {isCurrentOwner ? 'Current Owner' : 'Previous Owner'}
                          </div>
                          {owner.verificationAuthority && (
                            <div className="text-xs text-gray-400 mt-1">
                              {owner.verificationAuthority}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Offers Sidebar */}
        <div>
          <Card>
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Offers</h2>
                <Badge variant="primary">{propertyOffers.length} Total</Badge>
              </div>
              
              <div className="space-y-4">
                {propertyOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-lg font-bold text-primary-600">
                        SAR {offer.amount.toLocaleString()}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-gray-900">{offer.buyerName}</div>
                        <VerificationBadge kycStatus="verified" size="sm" showText={false} />
                      </div>
                      <div className="text-sm text-gray-500">Buyer ID: {offer.buyerId}</div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">I am interested in this property.</p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={offer.status === 'pending' ? 'warning' : offer.status === 'accepted' ? 'success' : 'neutral'}
                      >
                        {offer.status === 'pending' ? '⏳ Pending' : 
                         offer.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                      </Badge>
                      
                      {offer.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleOfferAction(offer.id, 'accept')}
                            className="btn btn-success btn-sm"
                            disabled={offersLoading}
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleOfferAction(offer.id, 'decline')}
                            className="btn btn-danger btn-sm"
                            disabled={offersLoading}
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      
                      {offer.status === 'accepted' && (
                        <button 
                          onClick={() => handleCompleteTransaction(offer.id, offer.buyerId, offer.amount)}
                          className="btn btn-primary btn-sm"
                        >
                          Complete Transaction
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Property Edit Modal - Disabled for demo */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Property</h3>
            <p className="text-gray-600 mb-4">Property editing is disabled in demo mode.</p>
            <button 
              onClick={() => setIsEditing(false)}
              className="btn btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Face Verification Modal */}
      {showVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl">
            <FaceVerification
              onSuccess={pendingAction ? handleVerificationSuccess : handleTransactionVerificationSuccess}
              onCancel={onVerificationCancel}
              title="Face Verification Required"
              description={pendingAction 
                ? `Please verify your identity to ${pendingAction.action} this offer`
                : "Please verify your identity to complete this transaction"
              }
              isQuickCheck={true}
            />
          </div>
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

export default SellerPage;
