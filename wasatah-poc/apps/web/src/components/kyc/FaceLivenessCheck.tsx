import { useState, useEffect, useRef } from 'react';
import { useKYCStore } from '../../stores/useKYCStore';
import type { KYCLivenessCheck } from '../../types/models';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button, Badge } from '../ui';

interface FaceLivenessCheckProps {
  onNext: () => void;
  onBack: () => void;
}

const FaceLivenessCheck = ({ onNext, onBack }: FaceLivenessCheckProps) => {
  const { kycData, updateLivenessCheck } = useKYCStore();
  const [currentStep, setCurrentStep] = useState<'instructions' | 'recording' | 'processing' | 'completed' | 'failed'>('instructions');
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const maxAttempts = 3;

  const livenessCheck = kycData?.livenessCheck;

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


  const simulateLivenessCheck = async () => {
    setCurrentStep('processing');
    setProgress(0);
    
    // Simulate processing steps
    const steps = [
      'Initializing face detection...',
      'Analyzing facial features...',
      'Checking for liveness indicators...',
      'Verifying document match...',
      'Generating confidence score...',
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // DEMO MODE: 100% success rate for demonstration purposes
    // In production, this would be: const success = Math.random() > 0.2; // 80% success rate
    const success = true; // Always succeed in demo
    const confidence = 95; // High confidence for demo
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const livenessCheckData: KYCLivenessCheck = {
      id: `liveness_${Date.now()}`,
      status: success ? 'completed' : 'failed',
      completedAt: success ? new Date().toISOString() : undefined,
      confidence,
      attempts: newAttempts,
      maxAttempts,
    };

    updateLivenessCheck(livenessCheckData);
    
    if (success) {
      setCurrentStep('completed');
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

  const handleNext = () => {
    if (currentStep === 'completed') {
      onNext();
    }
  };

  const renderInstructions = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">📱</div>
      <h3 className="text-xl font-semibold text-gray-900">Face Liveness Check</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        We need to verify that you are a real person by taking a quick selfie video.
      </p>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
        <h4 className="font-semibold text-yellow-800 mb-2">📋 Instructions:</h4>
        <ul className="text-yellow-700 text-sm space-y-1 text-left">
          <li>• Position your face in the center of the frame</li>
          <li>• Ensure good lighting on your face</li>
          <li>• Look directly at the camera</li>
          <li>• Blink naturally when prompted</li>
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
        <p className="text-gray-600">Please look directly at the camera and blink naturally</p>
        
        <div className="flex justify-center space-x-4">
          <Button
            onClick={simulateLivenessCheck}
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
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl animate-spin">⏳</div>
      <h3 className="text-xl font-semibold text-gray-900">Processing Your Face Check</h3>
      <p className="text-gray-600">Please wait while we verify your identity...</p>
      
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
      <h3 className="text-xl font-semibold text-green-600">Face Check Successful!</h3>
      <p className="text-gray-600">Your identity has been verified successfully.</p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <span className="text-green-800 font-medium">Confidence Score:</span>
          <Badge variant="success">{livenessCheck?.confidence}%</Badge>
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white"
      >
        Continue to Review
      </Button>
    </div>
  );

  const renderFailed = () => (
    <div className="text-center space-y-6">
      <div className="text-6xl">❌</div>
      <h3 className="text-xl font-semibold text-red-600">Face Check Failed</h3>
      <p className="text-gray-600">
        {attempts >= maxAttempts 
          ? 'Maximum attempts reached. Please contact support for assistance.'
          : 'The face check could not be completed. Please try again.'
        }
      </p>
      
      {livenessCheck && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-red-800 font-medium">Confidence Score:</span>
            <Badge variant="danger">{livenessCheck.confidence}%</Badge>
          </div>
        </div>
      )}

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
          onClick={onBack}
          variant="outline"
          className="px-6 py-2"
        >
          Back to Documents
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Face Liveness Check</h2>
        <p className="text-gray-600">Complete your identity verification with a quick face check</p>
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

export default FaceLivenessCheck;
