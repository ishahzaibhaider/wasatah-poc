import { create } from 'zustand';
import type { Offer, OfferForm, OfferStatus } from '../types/models';
import { 
  getStoredOffers, 
  saveStoredOffer, 
  getCurrentUser,
  type StoredOffer 
} from '../utils/browserStorage';

interface OfferState {
  // State
  offers: Offer[];
  currentOffer: Offer | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadOffers: () => Promise<void>;
  loadOffer: (id: string) => Promise<Offer | null>;
  createOffer: (offerData: OfferForm) => Promise<Offer>;
  updateOfferStatus: (id: string, status: OfferStatus, message?: string) => Promise<Offer>;
  withdrawOffer: (id: string) => Promise<void>;
  getOffersByProperty: (propertyId: string) => Offer[];
  getOffersByBuyer: (buyerId: string) => Offer[];
  getOffersBySeller: (sellerId: string) => Offer[];
  getPendingOffers: () => Offer[];
  clearError: () => void;
  clearOffers: () => void;
}

export const useOfferStore = create<OfferState>((set, get) => ({
  // Initial state
  offers: [],
  currentOffer: null,
  isLoading: false,
  error: null,

  // Actions
  loadOffers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Loading offers from browser storage...');
      
      // Load from browser storage
      const storedOffers = getStoredOffers();
      
      // Convert stored offers to Offer format
      const offers: Offer[] = storedOffers.map((storedOffer: StoredOffer) => ({
        id: storedOffer.id,
        propertyId: storedOffer.propertyId,
        buyerId: storedOffer.buyerId,
        buyerName: storedOffer.buyerName,
        amount: storedOffer.amount,
        currency: 'SAR',
        message: 'I am interested in this property.',
        status: storedOffer.status,
        submittedAt: storedOffer.createdAt,
        conditions: ['Subject to inspection', '30-day closing'],
        expiresAt: storedOffer.expiresAt,
      }));
      
      set({
        offers: offers,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load offers',
      });
    }
  },

  loadOffer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to load single offer
      console.log('Loading offer:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offers = get().offers;
      const offer = offers.find(o => o.id === id) || null;
      
      set({
        currentOffer: offer,
        isLoading: false,
      });
      
      return offer;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load offer',
      });
      return null;
    }
  },

  createOffer: async (offerData: OfferForm) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Creating offer in browser storage:', offerData);
      
      // Get current user
      const currentUser = getCurrentUser();
      
      // Create stored offer
      const storedOffer: StoredOffer = {
        id: `offer_${Date.now()}`,
        propertyId: offerData.propertyId,
        buyerId: currentUser?.id || 'current_user',
        buyerName: currentUser?.name || 'Current User',
        amount: offerData.amount,
        status: 'locked',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      };
      
      // Save to browser storage
      saveStoredOffer(storedOffer);
      
      // Convert to Offer format
      const newOffer: Offer = {
        id: storedOffer.id,
        propertyId: storedOffer.propertyId,
        buyerId: storedOffer.buyerId,
        buyerName: storedOffer.buyerName,
        amount: storedOffer.amount,
        currency: 'SAR',
        message: offerData.message || 'I am interested in this property.',
        status: storedOffer.status,
        submittedAt: storedOffer.createdAt,
        conditions: offerData.conditions || ['Subject to inspection', '30-day closing'],
        expiresAt: storedOffer.expiresAt,
      };
      
      const offers = get().offers;
      set({
        offers: [...offers, newOffer],
        isLoading: false,
      });
      
      return newOffer;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create offer',
      });
      throw error;
    }
  },

  updateOfferStatus: async (id: string, status: OfferStatus, message?: string) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Updating offer status in browser storage:', id, status, message);
      
      // Update in browser storage
      const storedOffers = getStoredOffers();
      const storedOffer = storedOffers.find(o => o.id === id);
      
      if (storedOffer) {
        storedOffer.status = status;
        saveStoredOffer(storedOffer);
      }
      
      const offers = get().offers;
      const updatedOffers = offers.map(offer =>
        offer.id === id 
          ? { 
              ...offer, 
              status, 
              respondedAt: new Date().toISOString(),
              message: message || offer.message,
            }
          : offer
      );
      
      const currentOffer = get().currentOffer;
      set({
        offers: updatedOffers,
        currentOffer: currentOffer?.id === id 
          ? { 
              ...currentOffer, 
              status, 
              respondedAt: new Date().toISOString(),
              message: message || currentOffer.message,
            }
          : currentOffer,
        isLoading: false,
      });
      
      return updatedOffers.find(o => o.id === id)!;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update offer',
      });
      throw error;
    }
  },

  withdrawOffer: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Implement API call to withdraw offer
      console.log('Withdrawing offer:', id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const offers = get().offers;
      const updatedOffers = offers.map(offer =>
        offer.id === id 
          ? { 
              ...offer, 
              status: 'withdrawn' as OfferStatus,
              respondedAt: new Date().toISOString(),
            }
          : offer
      );
      
      const currentOffer = get().currentOffer;
      set({
        offers: updatedOffers,
        currentOffer: currentOffer?.id === id 
          ? { 
              ...currentOffer, 
              status: 'withdrawn' as OfferStatus,
              respondedAt: new Date().toISOString(),
            }
          : currentOffer,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to withdraw offer',
      });
    }
  },

  getOffersByProperty: (propertyId: string) => {
    return get().offers.filter(o => o.propertyId === propertyId);
  },

  getOffersByBuyer: (buyerId: string) => {
    return get().offers.filter(o => o.buyerId === buyerId);
  },

  getOffersBySeller: (sellerId: string) => {
    // TODO: Implement logic to get offers for properties owned by seller
    // For now, return empty array
    console.log('Getting offers for seller:', sellerId);
    return [];
  },

  getPendingOffers: () => {
    return get().offers.filter(o => o.status === 'pending');
  },

  clearError: () => {
    set({ error: null });
  },

  clearOffers: () => {
    set({ offers: [] });
  },
}));
