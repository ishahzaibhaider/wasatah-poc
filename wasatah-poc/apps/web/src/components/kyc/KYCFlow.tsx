import { useState, useEffect } from 'react';
import { useKYCStore } from '../../stores/useKYCStore';
import { useAuthStore } from '../../stores/useAuthStore';
import PersonalInfoForm from './PersonalInfoForm';
import DocumentUploadForm from './DocumentUploadForm';
import FaceLivenessCheck from './FaceLivenessCheck';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import LoadingSpinner from '../LoadingSpinner';

interface KYCFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

type KYCStep = 'personal-info' | 'documents' | 'liveness' | 'review' | 'submitting' | 'completed';

const KYCFlow = ({ onComplete, onCancel }: KYCFlowProps) => {
  const { user } = useAuthStore();
  const { kycData, startKYC, submitKYC, isLoading } = useKYCStore();
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal-info');
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    if (user && !kycData) {
      startKYC(user.id);
    }
  }, [user, kycData, startKYC]);

  useEffect(() => {
    // Update progress based on current step
    const stepProgress = {
      'personal-info': 25,
      'documents': 50,
      'liveness': 75,
      'review': 90,
      'submitting': 95,
      'completed': 100,
    };
    setProgress(stepProgress[currentStep]);
  }, [currentStep]);

  const handleNext = () => {
    switch (currentStep) {
      case 'personal-info':
        setCurrentStep('documents');
        break;
      case 'documents':
        setCurrentStep('liveness');
        break;
      case 'liveness':
        setCurrentStep('review');
        break;
      case 'review':
        setCurrentStep('submitting');
        submitKYC();
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'documents':
        setCurrentStep('personal-info');
        break;
      case 'liveness':
        setCurrentStep('documents');
        break;
      case 'review':
        setCurrentStep('liveness');
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'personal-info', label: 'Personal Info', icon: '👤' },
      { key: 'documents', label: 'Documents', icon: '📄' },
      { key: 'liveness', label: 'Face Check', icon: '📱' },
      { key: 'review', label: 'Review', icon: '✅' },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : isActive 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}>
                {isCompleted ? '✓' : step.icon}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-primary-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderReview = () => (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Information</h2>
        <p className="text-gray-600">Please review all the information before submitting for verification</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {/* Personal Information Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              👤 Personal Information
            </h3>
            {kycData?.personalInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <p className="text-gray-900">{kycData.personalInfo.firstName} {kycData.personalInfo.lastName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date of Birth:</span>
                  <p className="text-gray-900">{new Date(kycData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Nationality:</span>
                  <p className="text-gray-900">{kycData.personalInfo.nationality}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-900">{kycData.personalInfo.phoneNumber}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-900">
                    {kycData.personalInfo.address.street}, {kycData.personalInfo.address.city}, 
                    {kycData.personalInfo.address.state} {kycData.personalInfo.address.postalCode}, 
                    {kycData.personalInfo.address.country}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Documents Review */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              📄 Uploaded Documents
            </h3>
            <div className="space-y-3">
              {kycData?.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-900">{doc.fileName}</p>
                      <p className="text-sm text-gray-600">
                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Uploaded</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Liveness Check Review */}
          {kycData?.livenessCheck && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                📱 Face Liveness Check
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Verification Status</p>
                  <p className="text-sm text-gray-600">
                    Completed on {new Date(kycData.livenessCheck.completedAt!).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="success">Verified</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Confidence: {kycData.livenessCheck.confidence}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="px-6 py-2"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white"
            >
              Submit for Verification
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const renderSubmitting = () => (
    <Card className="max-w-2xl mx-auto">
      <CardBody className="text-center py-12">
        <LoadingSpinner size="large" />
        <h3 className="text-xl font-semibold text-gray-900 mt-6">Submitting Your KYC</h3>
        <p className="text-gray-600 mt-2">
          Please wait while we process your verification request...
        </p>
      </CardBody>
    </Card>
  );

  const renderCompleted = () => {
    const isVerified = kycData?.status === 'verified';
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardBody className="text-center py-12">
          <div className="text-6xl mb-6">{isVerified ? '✅' : '❌'}</div>
          <h3 className={`text-2xl font-bold mb-4 ${
            isVerified ? 'text-green-600' : 'text-red-600'
          }`}>
            {isVerified ? 'KYC Verification Successful!' : 'KYC Verification Failed'}
          </h3>
          <p className="text-gray-600 mb-6">
            {isVerified 
              ? 'Your identity has been successfully verified. You can now access all platform features.'
              : kycData?.rejectionReason || 'Your KYC verification could not be completed. Please try again or contact support.'
            }
          </p>
          
          {isVerified && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600 font-medium">Verification Badge:</span>
                <Badge variant="success" className="text-sm">
                  🏆 Verified User
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={handleComplete}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white"
          >
            {isVerified ? 'Continue to Dashboard' : 'Try Again'}
          </Button>
        </CardBody>
      </Card>
    );
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardBody className="text-center py-12">
          <p className="text-gray-600">Please log in to start KYC verification.</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Step {Math.ceil(progress / 25)} of 4 - {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Step Indicator */}
        {currentStep !== 'submitting' && currentStep !== 'completed' && renderStepIndicator()}

        {/* Step Content */}
        {currentStep === 'personal-info' && (
          <PersonalInfoForm onNext={handleNext} />
        )}
        
        {currentStep === 'documents' && (
          <DocumentUploadForm onNext={handleNext} onBack={handleBack} />
        )}
        
        {currentStep === 'liveness' && (
          <FaceLivenessCheck onNext={handleNext} onBack={handleBack} />
        )}
        
        {currentStep === 'review' && renderReview()}
        
        {currentStep === 'submitting' && renderSubmitting()}
        
        {currentStep === 'completed' && renderCompleted()}

        {/* Cancel Button */}
        {currentStep !== 'submitting' && currentStep !== 'completed' && (
          <div className="text-center mt-8">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel KYC Process
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KYCFlow;
