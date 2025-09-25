import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KYCData, KYCStatus, KYCPersonalInfo, KYCDocument, KYCLivenessCheck } from '../types/models';
import { useAuthStore } from './useAuthStore';

interface KYCState {
  kycData: KYCData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startKYC: (userId: string) => void;
  updatePersonalInfo: (personalInfo: KYCPersonalInfo) => void;
  uploadDocument: (document: KYCDocument) => void;
  updateLivenessCheck: (livenessCheck: KYCLivenessCheck) => void;
  submitKYC: () => void;
  updateKYCStatus: (status: KYCStatus, rejectionReason?: string) => void;
  clearKYC: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useKYCStore = create<KYCState>()(
  persist(
    (set, get) => ({
      kycData: null,
      isLoading: false,
      error: null,

      startKYC: (userId: string) => {
        const kycData: KYCData = {
          id: `kyc_${Date.now()}`,
          userId,
          status: 'in_progress',
          documents: [],
          riskScore: 0,
          verificationMethod: 'hybrid',
        };
        set({ kycData, error: null });
      },

      updatePersonalInfo: (personalInfo: KYCPersonalInfo) => {
        const { kycData } = get();
        if (kycData) {
          set({
            kycData: {
              ...kycData,
              personalInfo,
            },
          });
        }
      },

      uploadDocument: (document: KYCDocument) => {
        const { kycData } = get();
        if (kycData) {
          const updatedDocuments = [...kycData.documents];
          const existingIndex = updatedDocuments.findIndex(doc => doc.type === document.type);
          
          if (existingIndex >= 0) {
            updatedDocuments[existingIndex] = document;
          } else {
            updatedDocuments.push(document);
          }

          set({
            kycData: {
              ...kycData,
              documents: updatedDocuments,
            },
          });
        }
      },

      updateLivenessCheck: (livenessCheck: KYCLivenessCheck) => {
        const { kycData } = get();
        if (kycData) {
          set({
            kycData: {
              ...kycData,
              livenessCheck,
            },
          });
        }
      },

      submitKYC: () => {
        const { kycData } = get();
        if (kycData) {
          // Simulate KYC submission
          set({
            kycData: {
              ...kycData,
              status: 'pending_review',
              submittedAt: new Date().toISOString(),
            },
            isLoading: true,
          });

          // Simulate processing delay
          setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate for demo
            const riskScore = Math.floor(Math.random() * 30) + 10; // 10-40 risk score
            const finalStatus: KYCStatus = success ? 'verified' : 'rejected';
            
            const updatedKYCData = {
              ...kycData,
              status: finalStatus,
              submittedAt: new Date().toISOString(),
              reviewedAt: new Date().toISOString(),
              verifiedAt: success ? new Date().toISOString() : undefined,
              rejectionReason: success ? undefined : 'Document quality insufficient. Please retake photos with better lighting.',
              riskScore,
              expiresAt: success ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined, // 1 year
            };
            
            set({
              kycData: updatedKYCData,
              isLoading: false,
            });

            // Update auth store with KYC status
            useAuthStore.getState().updateKYCStatus(finalStatus);
          }, 3000);
        }
      },

      updateKYCStatus: (status: KYCStatus, rejectionReason?: string) => {
        const { kycData } = get();
        if (kycData) {
          set({
            kycData: {
              ...kycData,
              status,
              rejectionReason,
              reviewedAt: new Date().toISOString(),
              verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
            },
          });
        }
      },

      clearKYC: () => {
        set({ kycData: null, error: null });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'kyc-storage',
      partialize: (state) => ({ kycData: state.kycData }),
    }
  )
);
