// Browser storage utilities for Wasatah.app PoC
// This simulates a distributed blockchain system using local browser storage

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'broker';
  digitalId: string;
  createdAt: string;
  verified: boolean;
}

export interface StoredOffer {
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'locked' | 'withdrawn' | 'expired';
  createdAt: string;
  expiresAt?: string;
}

export interface StoredLedgerEvent {
  id: string;
  type: string;
  userId: string;
  userName: string;
  timestamp: string;
  data: any;
  signature: string;
  blockHash: string;
}

export interface StoredRiskFlag {
  id: string;
  userId: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp: string;
  resolved: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  USERS: 'wasatah_users',
  OFFERS: 'wasatah_offers',
  LEDGER_EVENTS: 'wasatah_ledger_events',
  RISK_FLAGS: 'wasatah_risk_flags',
  CURRENT_USER: 'wasatah_current_user',
  PROPERTIES: 'wasatah_properties'
} as const;

// Generic storage functions
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key ${key}:`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
  }
};

// User management
export const getStoredUsers = (): StoredUser[] => {
  return getStorageItem(STORAGE_KEYS.USERS, []);
};

export const saveStoredUser = (user: StoredUser): void => {
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  
  setStorageItem(STORAGE_KEYS.USERS, users);
};

export const getStoredUserById = (id: string): StoredUser | null => {
  const users = getStoredUsers();
  return users.find(u => u.id === id) || null;
};

export const getStoredUserByEmail = (email: string): StoredUser | null => {
  const users = getStoredUsers();
  return users.find(u => u.email === email) || null;
};

// Offer management
export const getStoredOffers = (): StoredOffer[] => {
  return getStorageItem(STORAGE_KEYS.OFFERS, []);
};

export const saveStoredOffer = (offer: StoredOffer): void => {
  const offers = getStoredOffers();
  const existingIndex = offers.findIndex(o => o.id === offer.id);
  
  if (existingIndex >= 0) {
    offers[existingIndex] = offer;
  } else {
    offers.push(offer);
  }
  
  setStorageItem(STORAGE_KEYS.OFFERS, offers);
};

export const getStoredOffersByBuyer = (buyerId: string): StoredOffer[] => {
  const offers = getStoredOffers();
  return offers.filter(o => o.buyerId === buyerId);
};

export const getStoredOffersByProperty = (propertyId: string): StoredOffer[] => {
  const offers = getStoredOffers();
  return offers.filter(o => o.propertyId === propertyId);
};

// Ledger management
export const getStoredLedgerEvents = (): StoredLedgerEvent[] => {
  return getStorageItem(STORAGE_KEYS.LEDGER_EVENTS, []);
};

export const addStoredLedgerEvent = (event: Omit<StoredLedgerEvent, 'id' | 'timestamp' | 'signature' | 'blockHash'>): StoredLedgerEvent => {
  const events = getStoredLedgerEvents();
  
  const newEvent: StoredLedgerEvent = {
    ...event,
    id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    signature: `sig_${Math.random().toString(36).substr(2, 16)}`, // Simulated signature
    blockHash: `block_${Math.random().toString(36).substr(2, 16)}` // Simulated block hash
  };
  
  events.push(newEvent);
  setStorageItem(STORAGE_KEYS.LEDGER_EVENTS, events);
  
  return newEvent;
};

// Risk flag management
export const getStoredRiskFlags = (): StoredRiskFlag[] => {
  return getStorageItem(STORAGE_KEYS.RISK_FLAGS, []);
};

export const addStoredRiskFlag = (flag: Omit<StoredRiskFlag, 'id' | 'timestamp'>): StoredRiskFlag => {
  const flags = getStoredRiskFlags();
  
  const newFlag: StoredRiskFlag = {
    ...flag,
    id: `risk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  flags.push(newFlag);
  setStorageItem(STORAGE_KEYS.RISK_FLAGS, flags);
  
  return newFlag;
};

export const resolveStoredRiskFlag = (flagId: string): void => {
  const flags = getStoredRiskFlags();
  const flag = flags.find(f => f.id === flagId);
  if (flag) {
    flag.resolved = true;
    setStorageItem(STORAGE_KEYS.RISK_FLAGS, flags);
  }
};

// Current user management
export const getCurrentUser = (): StoredUser | null => {
  return getStorageItem(STORAGE_KEYS.CURRENT_USER, null);
};

export const setCurrentUser = (user: StoredUser | null): void => {
  setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
};

// Properties (static data)
export const getStoredProperties = () => {
  return getStorageItem(STORAGE_KEYS.PROPERTIES, [
    {
      id: 'prop_001',
      title: 'Luxury Villa in Riyadh',
      description: 'Beautiful 4-bedroom villa with modern amenities',
      price: 2500000,
      location: 'Riyadh, Saudi Arabia',
      bedrooms: 4,
      bathrooms: 3,
      area: 350,
      images: ['/images/villa1.jpg'],
      ownerId: 'owner_001',
      ownerName: 'Ahmed Al-Rashid',
      verified: true,
      deedVerified: true,
      ownershipHistory: [
        { owner: 'Ahmed Al-Rashid', from: '2020-01-01', to: null },
        { owner: 'Sara Al-Mansouri', from: '2018-06-15', to: '2019-12-31' }
      ]
    }
  ]);
};

// Clear all data (for demo reset)
export const clearAllStoredData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeStorageItem(key);
  });
  console.log('🧹 All demo data cleared from browser storage');
};

// Initialize demo data if empty
export const initializeDemoData = (): void => {
  const events = getStoredLedgerEvents();
  if (events.length === 0) {
    // Add some initial demo events
    addStoredLedgerEvent({
      type: 'property_listed',
      userId: 'owner_001',
      userName: 'Ahmed Al-Rashid',
      data: { propertyId: 'prop_001', price: 2500000 }
    });
    
    addStoredLedgerEvent({
      type: 'system_initialized',
      userId: 'system',
      userName: 'Wasatah System',
      data: { version: '1.0.0', timestamp: new Date().toISOString() }
    });
  }
};
