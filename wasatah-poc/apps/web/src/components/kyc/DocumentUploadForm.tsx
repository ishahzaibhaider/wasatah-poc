import { useState, useRef } from 'react';
import { useKYCStore } from '../../stores/useKYCStore';
import type { KYCDocument } from '../../types/models';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button, Badge } from '../ui';

interface DocumentUploadFormProps {
  onNext: () => void;
  onBack: () => void;
}

const DocumentUploadForm = ({ onNext, onBack }: DocumentUploadFormProps) => {
  const { kycData, uploadDocument } = useKYCStore();
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const requiredDocuments = [
    {
      type: 'national_id' as const,
      title: 'National ID / Passport',
      description: 'Upload a clear photo of your national ID or passport',
      acceptedTypes: 'image/*,.pdf',
      required: true,
    },
    {
      type: 'utility_bill' as const,
      title: 'Proof of Address',
      description: 'Upload a recent utility bill or bank statement (not older than 3 months)',
      acceptedTypes: 'image/*,.pdf',
      required: true,
    },
    {
      type: 'driving_license' as const,
      title: 'Driving License (Optional)',
      description: 'Additional verification document',
      acceptedTypes: 'image/*,.pdf',
      required: false,
    },
  ];

  const handleFileUpload = async (type: string, file: File) => {
    setUploading(type);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const document: KYCDocument = {
      id: `doc_${Date.now()}_${type}`,
      type: type as any,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
    };

    uploadDocument(document);
    setUploading(null);
  };

  const handleFileChange = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload only JPEG, PNG, or PDF files');
        return;
      }

      handleFileUpload(type, file);
    }
  };

  const getDocumentStatus = (type: string) => {
    const doc = kycData?.documents.find(d => d.type === type);
    if (!doc) return null;
    
    switch (doc.status) {
      case 'uploaded':
        return { status: 'success', text: 'Uploaded', color: 'green' };
      case 'processing':
        return { status: 'processing', text: 'Processing', color: 'yellow' };
      case 'verified':
        return { status: 'verified', text: 'Verified', color: 'green' };
      case 'rejected':
        return { status: 'rejected', text: 'Rejected', color: 'red' };
      default:
        return null;
    }
  };

  const isDocumentUploaded = (type: string) => {
    return kycData?.documents.some(d => d.type === type) || false;
  };

  const canProceed = () => {
    const requiredDocs = requiredDocuments.filter(doc => doc.required);
    return requiredDocs.every(doc => isDocumentUploaded(doc.type));
  };

  const handleNext = () => {
    if (canProceed()) {
      onNext();
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="text-gray-600">Please upload the required documents for identity verification</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-6">
          {requiredDocuments.map((doc) => {
            const isUploaded = isDocumentUploaded(doc.type);
            const docStatus = getDocumentStatus(doc.type);
            const isCurrentlyUploading = uploading === doc.type;

            return (
              <div key={doc.type} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {doc.title}
                      {doc.required && <span className="text-red-500">*</span>}
                    </h3>
                    <p className="text-gray-600 mt-1">{doc.description}</p>
                  </div>
                  {docStatus && (
                    <Badge 
                      variant={docStatus.status === 'verified' ? 'success' : 
                              docStatus.status === 'rejected' ? 'danger' : 'secondary'}
                    >
                      {docStatus.text}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <input
                    ref={(el) => { fileInputRefs.current[doc.type] = el; }}
                    type="file"
                    accept={doc.acceptedTypes}
                    onChange={(e) => handleFileChange(doc.type, e)}
                    className="hidden"
                    disabled={isCurrentlyUploading}
                  />
                  
                  <Button
                    type="button"
                    variant={isUploaded ? "outline" : "default"}
                    onClick={() => fileInputRefs.current[doc.type]?.click()}
                    disabled={isCurrentlyUploading}
                    className="flex items-center gap-2"
                  >
                    {isCurrentlyUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : isUploaded ? (
                      <>
                        📄 Replace Document
                      </>
                    ) : (
                      <>
                        📤 Upload Document
                      </>
                    )}
                  </Button>

                  {isUploaded && (
                    <div className="text-sm text-gray-600">
                      {kycData?.documents.find(d => d.type === doc.type)?.fileName}
                    </div>
                  )}
                </div>

                {docStatus?.status === 'rejected' && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      <strong>Rejection Reason:</strong> {kycData?.documents.find(d => d.type === doc.type)?.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Upload Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Upload Guidelines</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ensure documents are clear and all text is readable</li>
              <li>• Use good lighting and avoid shadows or glare</li>
              <li>• File size must be less than 10MB</li>
              <li>• Accepted formats: JPEG, PNG, PDF</li>
              <li>• Documents must be in color and high resolution</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="px-6 py-2"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
            >
              Continue to Face Verification
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DocumentUploadForm;
