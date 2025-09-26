import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui';

interface FaceVerificationProps {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  isQuickCheck?: boolean; // true for verified users, false for full KYC
}

const FaceVerification = ({ 
  onSuccess, 
  onCancel, 
  title = "Face Verification",
  description = "Please look at the camera to verify your identity",
  isQuickCheck = false
}: FaceVerificationProps) => {
  const [currentStep, setCurrentStep] = useState<'instructions' | 'recording' | 'processing' | 'completed' | 'failed'>('instructions');
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxAttempts = isQuickCheck ? 2 : 3;

  useEffect(() => {
    if (currentStep === 'recording') {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [currentStep]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCurrentStep('failed');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const simulateFaceVerification = async () => {
    setCurrentStep('processing');
    setProgress(0);
    
    // Simulate processing steps
    const steps = isQuickCheck 
      ? [
          'Initializing face detection...',
          'Verifying identity match...',
          'Generating confidence score...',
        ]
      : [
          'Initializing face detection...',
          'Analyzing facial features...',
          'Checking for liveness indicators...',
          'Verifying document match...',
          'Generating confidence score...',
        ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, isQuickCheck ? 800 : 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Simulate success/failure with different rates based on verification type
    const successRate = isQuickCheck ? 0.95 : 0.8; // 95% for quick checks, 80% for full KYC
    const success = Math.random() > (1 - successRate);
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (success) {
      setCurrentStep('completed');
      // Auto-proceed after a short delay
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else if (newAttempts >= maxAttempts) {
      setCurrentStep('failed');
    } else {
      setCurrentStep('failed');
    }
  };

  const startRecording = () => {
    setCurrentStep('recording');
  };

  const retryCheck = () => {
    setCurrentStep('instructions');
    setProgress(0);
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">{isQuickCheck ? '👤' : '📱'}</div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {description}
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-semibold text-blue-800 mb-2">📋 Instructions:</h4>
        <ul className="text-blue-700 text-sm space-y-1 text-left">
          <li>• Position your face in the center of the frame</li>
          <li>• Ensure good lighting on your face</li>
          <li>• Look directly at the camera</li>
          {!isQuickCheck && <li>• Blink naturally when prompted</li>}
          <li>• Keep your head still during recording</li>
        </ul>
      </div>

      {attempts > 0 && (
        <div className="text-sm text-gray-600">
          Attempt {attempts} of {maxAttempts}
        </div>
      )}

      <Button
        onClick={startRecording}
        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white"
        disabled={attempts >= maxAttempts}
      >
        {attempts >= maxAttempts ? 'Max Attempts Reached' : 'Start Face Check'}
      </Button>
    </div>
  );

  const renderRecording = () => (
    <div className="text-center space-y-6">
      <div className="relative mx-auto w-80 h-60 bg-gray-100 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white rounded-full"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Recording in Progress</h3>
        <p className="text-gray-600">
          {isQuickCheck 
            ? "Please look directly at the camera" 
            : "Please look directly at the camera and blink naturally"
          }
        </p>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={simulateFaceVerification}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white"
          >
            Complete Check
          </Button>
          <Button
            onClick={() => setCurrentStep('instructions')}
            variant="outline"
            className="px-6 py-2"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl animate-spin">⏳</div>
      <h3 className="text-xl font-semibold text-gray-900">
        {isQuickCheck ? 'Verifying Identity' : 'Processing Your Face Check'}
      </h3>
      <p className="text-gray-600">
        {isQuickCheck 
          ? 'Please wait while we verify your identity...' 
          : 'Please wait while we verify your identity...'
        }
      </p>
      
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Complete</p>
      </div>
    </div>
  );

  const renderCompleted = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">✅</div>
      <h3 className="text-xl font-semibold text-green-600">
        {isQuickCheck ? 'Identity Verified!' : 'Face Check Successful!'}
      </h3>
      <p className="text-gray-600">
        {isQuickCheck 
          ? 'Your identity has been verified successfully.' 
          : 'Your identity has been verified successfully.'
        }
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-green-800 font-medium">Confidence Score:</span>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
            {Math.floor(Math.random() * 15) + 85}%
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500">Proceeding automatically...</p>
    </div>
  );

  const renderFailed = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">❌</div>
      <h3 className="text-xl font-semibold text-red-600">
        {isQuickCheck ? 'Verification Failed' : 'Face Check Failed'}
      </h3>
      <p className="text-gray-600">
        {attempts >= maxAttempts 
          ? 'Maximum attempts reached. Please contact support for assistance.'
          : 'The verification could not be completed. Please try again.'
        }
      </p>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-red-800 font-medium">Confidence Score:</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
            {Math.floor(Math.random() * 40) + 30}%
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {attempts < maxAttempts && (
          <Button
            onClick={retryCheck}
            className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white"
          >
            Try Again
          </Button>
        )}
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 py-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </CardHeader>
      <CardBody>
        {currentStep === 'instructions' && renderInstructions()}
        {currentStep === 'recording' && renderRecording()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'completed' && renderCompleted()}
        {currentStep === 'failed' && renderFailed()}
      </CardBody>
    </Card>
  );
};

export default FaceVerification;
