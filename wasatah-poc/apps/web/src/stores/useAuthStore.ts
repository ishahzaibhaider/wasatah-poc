import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginForm, DigitalID, KYCStatus } from '../types/models';
import { 
  getStoredUserByEmail, 
  saveStoredUser, 
  setCurrentUser,
  addStoredLedgerEvent,
  type StoredUser 
} from '../utils/browserStorage';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setUser: (user: User) => void;
  verifyIdentity: (userId: string) => Promise<DigitalID>;
  updateKYCStatus: (status: KYCStatus) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check if user exists in browser storage
          const storedUser = getStoredUserByEmail(credentials.email);
          
          if (storedUser) {
            // Convert stored user to User type
            const user: User = {
              id: storedUser.id,
              name: storedUser.name,
              email: storedUser.email,
              phone: '+966501234567', // Default phone
              role: storedUser.role,
              createdAt: storedUser.createdAt,
              isActive: true,
              digitalId: {
                id: storedUser.digitalId,
                userId: storedUser.id,
                verified: storedUser.verified,
                verificationMethod: 'NAFTA_SIM' as const,
                issuedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                zkpProof: 'zkp_proof_' + Date.now(),
                riskScore: Math.floor(Math.random() * 20) + 5,
              },
              kycStatus: (storedUser.kycStatus as KYCStatus) || 'not_started'
            };
            
            setCurrentUser(storedUser);
            
            // Add login event to ledger
            await addStoredLedgerEvent({
              type: 'user_verified',
              userId: user.id,
              userName: user.name,
              data: { email: user.email, role: user.role }
            });
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            // Create new user for demo
            const newStoredUser: StoredUser = {
              id: 'demo_user_' + Date.now(),
              name: 'Demo User',
              email: credentials.email,
              role: 'buyer',
              digitalId: 'DID-' + Date.now(),
              createdAt: new Date().toISOString(),
              verified: true
            };
            
            saveStoredUser(newStoredUser);
            setCurrentUser(newStoredUser);
            
            const user: User = {
              id: newStoredUser.id,
              name: newStoredUser.name,
              email: newStoredUser.email,
              phone: '+966501234567',
              role: newStoredUser.role,
              createdAt: newStoredUser.createdAt,
              isActive: true,
              digitalId: {
                id: newStoredUser.digitalId,
                userId: newStoredUser.id,
                verified: newStoredUser.verified,
                verificationMethod: 'NAFTA_SIM' as const,
                issuedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                zkpProof: 'zkp_proof_' + Date.now(),
                riskScore: Math.floor(Math.random() * 20) + 5,
              },
              kycStatus: (newStoredUser.kycStatus as KYCStatus) || 'not_started'
            };
            
            // Add login event to ledger
            await addStoredLedgerEvent({
              type: 'user_verified',
              userId: user.id,
              userName: user.name,
              data: { email: user.email, role: user.role }
            });
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        
        try {
          // Create new user in browser storage
          const newStoredUser: StoredUser = {
            id: 'user_' + Date.now(),
            name: userData.name,
            email: userData.email,
            role: userData.role || 'buyer',
            digitalId: 'DID-' + Date.now(),
            createdAt: new Date().toISOString(),
            verified: true
          };
          
          saveStoredUser(newStoredUser);
          setCurrentUser(newStoredUser);
          
          const user: User = {
            id: newStoredUser.id,
            name: newStoredUser.name,
            email: newStoredUser.email,
            phone: userData.phone || '+966501234567',
            role: newStoredUser.role,
            createdAt: newStoredUser.createdAt,
            isActive: true,
            digitalId: {
              id: newStoredUser.digitalId,
              userId: newStoredUser.id,
              verified: newStoredUser.verified,
              verificationMethod: 'NAFTA_SIM' as const,
              issuedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              zkpProof: 'zkp_proof_' + Date.now(),
              riskScore: Math.floor(Math.random() * 20) + 5,
            },
            kycStatus: 'not_started' as KYCStatus
          };
          
          // Add registration event to ledger
          await addStoredLedgerEvent({
            type: 'user_registered',
            userId: user.id,
            userName: user.name,
            data: { email: user.email, role: user.role, digitalId: user.digitalId }
          });
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      logout: () => {
        setCurrentUser(null);
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      verifyIdentity: async (userId: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // TODO: Implement actual identity verification with NAFTA_SIM
          console.log('Verifying identity for user:', userId);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock digital ID
          const digitalId: DigitalID = {
            id: 'digital_id_001',
            userId,
            verified: true,
            verificationMethod: 'NAFTA_SIM',
            issuedAt: new Date().toISOString(),
            riskScore: 15, // Low risk
            zkpProof: 'zkp_proof_12345', // Simulated ZKP proof
          };
          
          // Update user with digital ID
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, digitalId },
              isLoading: false,
            });
          }
          
          return digitalId;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Identity verification failed',
          });
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateKYCStatus: (status: KYCStatus) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, kycStatus: status };
          
          // Update stored user data to persist KYC status
          const storedUser = getStoredUserByEmail(currentUser.email);
          if (storedUser) {
            const updatedStoredUser = { ...storedUser, kycStatus: status };
            saveStoredUser(updatedStoredUser);
          }
          
          set({
            user: updatedUser,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
