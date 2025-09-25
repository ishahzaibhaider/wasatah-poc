import { create } from 'zustand';
import type { LedgerEvent, EventType } from '../types/models';
import { 
  getStoredLedgerEvents, 
  addStoredLedgerEvent, 
  clearAllStoredData,
  initializeDemoData,
  type StoredLedgerEvent 
} from '../utils/browserStorage';

interface LedgerState {
  // State
  events: LedgerEvent[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadEvents: () => Promise<void>;
  addEvent: (type: EventType, actorId: string, actorName: string, details: Record<string, unknown>) => Promise<LedgerEvent>;
  getEventsByType: (type: EventType) => LedgerEvent[];
  getEventsByActor: (actorId: string) => LedgerEvent[];
  getRecentEvents: (limit?: number) => LedgerEvent[];
  clearEvents: () => void;
  clearError: () => void;
  resetLedger: () => Promise<void>;
}

export const useLedgerStore = create<LedgerState>((set, get) => ({
  // Initial state
  events: [],
  isLoading: false,
  error: null,

  // Actions
  loadEvents: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Loading ledger events from browser storage...');
      
      // Initialize demo data if empty
      initializeDemoData();
      
      // Load from browser storage
      const storedEvents = getStoredLedgerEvents();
      
      // Convert stored events to LedgerEvent format
      const events: LedgerEvent[] = storedEvents.map((storedEvent: StoredLedgerEvent) => ({
        id: storedEvent.id,
        type: storedEvent.type as EventType,
        actorId: storedEvent.userId,
        actorName: storedEvent.userName,
        timestamp: storedEvent.timestamp,
        details: storedEvent.data,
        signature: storedEvent.signature,
        hash: storedEvent.blockHash, // Use 'hash' instead of 'blockHash'
      }));
      
      set({
        events: events,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading ledger events:', error);
      set({
        events: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load ledger events',
      });
    }
  },

  addEvent: async (type: EventType, actorId: string, actorName: string, details: Record<string, unknown>) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Adding ledger event to browser storage:', type, actorId, actorName, details);
      
      // Add event to browser storage
      const storedEvent = addStoredLedgerEvent({
        type,
        userId: actorId,
        userName: actorName,
        data: details
      });
      
      // Convert to LedgerEvent format
      const newEvent: LedgerEvent = {
        id: storedEvent.id,
        type: storedEvent.type as EventType,
        actorId: storedEvent.userId,
        actorName: storedEvent.userName,
        timestamp: storedEvent.timestamp,
        details: storedEvent.data,
        signature: storedEvent.signature,
        hash: storedEvent.blockHash, // Use 'hash' instead of 'blockHash'
      };
      
      // Add the new event to the local state
      const events = get().events;
      set({
        events: [newEvent, ...events], // Add to beginning for chronological order
        isLoading: false,
      });
      
      return newEvent;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add ledger event',
      });
      throw error;
    }
  },

  getEventsByType: (type: EventType) => {
    return get().events.filter(e => e.type === type);
  },

  getEventsByActor: (actorId: string) => {
    return get().events.filter(e => e.actorId === actorId);
  },

  getRecentEvents: (limit: number = 10) => {
    return get().events.slice(0, limit);
  },

  clearEvents: () => {
    set({ events: [] });
  },

  clearError: () => {
    set({ error: null });
  },

  resetLedger: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Resetting ledger in browser storage...');
      
      // Clear all stored data
      clearAllStoredData();
      
      // Initialize fresh demo data
      initializeDemoData();
      
      // Reload events
      await get().loadEvents();
      
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset ledger',
      });
      throw error;
    }
  },
}));
