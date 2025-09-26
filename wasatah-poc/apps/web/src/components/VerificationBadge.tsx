import Badge from './ui/Badge';
import type { KYCStatus } from '../types/models';

interface VerificationBadgeProps {
  kycStatus?: KYCStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const VerificationBadge = ({ kycStatus, size = 'md', showText = true }: VerificationBadgeProps) => {
  const getBadgeConfig = () => {
    switch (kycStatus) {
      case 'verified':
        return {
          variant: 'success' as const,
          icon: '🏆',
          text: 'Verified',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending_review':
        return {
          variant: 'warning' as const,
          icon: '⏳',
          text: 'Under Review',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'in_progress':
        return {
          variant: 'primary' as const,
          icon: '🔄',
          text: 'In Progress',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'rejected':
        return {
          variant: 'neutral' as const,
          icon: '❌',
          text: 'Rejected',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'expired':
        return {
          variant: 'neutral' as const,
          icon: '⏰',
          text: 'Expired',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: '🔒',
          text: 'Not Verified',
          className: 'bg-gray-100 text-gray-600 border-gray-300'
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      <span className="text-xs">{config.icon}</span>
      {showText && <span>{config.text}</span>}
    </Badge>
  );
};

export default VerificationBadge;
