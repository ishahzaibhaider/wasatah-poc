import { Link } from 'react-router-dom';
import { Card, CardBody } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const DemoScriptPage = () => {

  const demoSteps = [
    {
      id: 1,
      title: "Login & Authentication",
      description: "Sign in with demo credentials and see Verified ID badge",
      duration: "30 seconds",
      actions: [
        "Click 'Sign In' on the landing page",
        "Use demo credentials: demo@wasatah.app / password123",
        "Observe the 'Verified ID' badge and NAFTA verification status",
        "Notice the ZKP verification indicators"
      ],
      expectedOutcome: "User dashboard with verified identity badges",
      route: "/login"
    },
    {
      id: 2,
      title: "Role Selection",
      description: "Choose your role (Buyer/Seller/Broker) to access specific features",
      duration: "15 seconds",
      actions: [
        "Navigate to role selection page",
        "Review the three available roles",
        "Select 'Buyer' role to start the demo flow",
        "Observe role-specific capabilities"
      ],
      expectedOutcome: "Role-specific dashboard with tailored features",
      route: "/role"
    },
    {
      id: 3,
      title: "Browse Verified Property",
      description: "View the featured property with Deed Verified status and ownership history",
      duration: "45 seconds",
      actions: [
        "Navigate to Buyer dashboard",
        "Review the luxury villa listing",
        "Examine 'Deed Verified' and 'ZKP Verified' badges",
        "Check the ownership history chain",
        "Note the property features and verification details"
      ],
      expectedOutcome: "Property details with blockchain verification",
      route: "/buyer"
    },
    {
      id: 4,
      title: "Make an Offer",
      description: "Submit an offer and see it get locked with blockchain confirmation",
      duration: "30 seconds",
      actions: [
        "Enter an offer amount (e.g., SAR 2,500,000)",
        "Add a message to the seller",
        "Click 'Submit Offer'",
        "Observe the 'Offer Locked' confirmation",
        "Check the offer status in 'My Offers' section"
      ],
      expectedOutcome: "Offer submitted and locked with blockchain record",
      route: "/buyer"
    },
    {
      id: 5,
      title: "Seller Perspective",
      description: "Switch to seller view to manage offers and complete transactions",
      duration: "60 seconds",
      actions: [
        "Navigate to Seller dashboard",
        "Review incoming offers",
        "Accept or decline offers",
        "Click 'Complete Transaction' for accepted offers",
        "Observe transaction completion with blockchain signature"
      ],
      expectedOutcome: "Transaction completed with blockchain verification",
      route: "/seller"
    },
    {
      id: 6,
      title: "Broker Facilitation",
      description: "Experience broker role in connecting buyers and sellers",
      duration: "45 seconds",
      actions: [
        "Navigate to Broker dashboard",
        "Click 'Link Buyer & Seller'",
        "Select buyer, seller, and property",
        "Create the connection",
        "Test the security features with 'Test Security' button"
      ],
      expectedOutcome: "Buyer-seller connection established with security validation",
      route: "/broker"
    },
    {
      id: 7,
      title: "Blockchain Explorer",
      description: "View all transactions and verifications in the blockchain explorer",
      duration: "60 seconds",
      actions: [
        "Navigate to Blockchain Explorer",
        "Review all transaction events",
        "Filter by event type (offers, transfers, verifications)",
        "Examine transaction details and signatures",
        "Copy transaction data to clipboard"
      ],
      expectedOutcome: "Complete transaction history with blockchain verification",
      route: "/explorer"
    },
    {
      id: 8,
      title: "Security & Risk Detection",
      description: "Trigger and observe identity impersonation detection",
      duration: "30 seconds",
      actions: [
        "Go to Broker dashboard",
        "Click 'Test Security' button",
        "Observe risk flag generation",
        "Check the security banner at the top",
        "Review risk assessment details"
      ],
      expectedOutcome: "Security alerts and risk flags displayed",
      route: "/broker"
    },
    {
      id: 9,
      title: "ZKP Education",
      description: "Learn about Zero-Knowledge Proofs and their real estate applications",
      duration: "90 seconds",
      actions: [
        "Navigate to 'About ZK' page",
        "Read about ZKP concepts and benefits",
        "Review real estate applications",
        "Examine technical implementation details",
        "View ZKP events in the explorer"
      ],
      expectedOutcome: "Understanding of ZKP technology and applications",
      route: "/about-zk"
    }
  ];

  const totalDuration = demoSteps.reduce((total, step) => {
    const duration = parseInt(step.duration);
    return total + duration;
  }, 0);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Script</h1>
        <p className="text-gray-600">Complete 5-minute investor demo walkthrough</p>
        <div className="mt-4 flex items-center space-x-4">
          <Badge variant="primary">Total Duration: {formatDuration(totalDuration)}</Badge>
          <Badge variant="success">9 Steps</Badge>
          <Badge variant="warning">Interactive Demo</Badge>
        </div>
      </div>

      {/* Demo Overview */}
      <Card className="mb-8">
        <CardBody className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demo Overview</h2>
          <p className="text-gray-700 mb-4">
            This script demonstrates the complete Wasatah.app blockchain + AI real estate platform. 
            Follow these steps to showcase all key features to investors in under 5 minutes.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="font-semibold text-blue-900">Identity Verification</h3>
              <p className="text-sm text-blue-700">NAFTA + ZKP simulation</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-semibold text-green-900">Property Transactions</h3>
              <p className="text-sm text-green-700">Blockchain-verified deals</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-semibold text-purple-900">Security & Risk</h3>
              <p className="text-sm text-purple-700">AI-powered fraud detection</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Demo Steps */}
      <div className="space-y-6">
        {demoSteps.map((step, index) => (
          <Card key={step.id} className={`transition-all duration-300 ${
            currentStep === index ? 'ring-2 ring-primary-500 shadow-lg' : 'hover:shadow-md'
          }`}>
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === index 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="primary">{step.duration}</Badge>
                  <Link
                    to={step.route}
                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Go to Step
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Actions to Perform:</h4>
                  <ol className="space-y-2">
                    {step.actions.map((action, actionIndex) => (
                      <li key={actionIndex} className="flex items-start text-sm text-gray-700">
                        <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                          {actionIndex + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Expected Outcome:</h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">{step.expectedOutcome}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Demo Tips */}
      <Card className="mt-8">
        <CardBody className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demo Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">For Investors:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Emphasize the blockchain transparency and immutability</li>
                <li>• Highlight the AI-powered fraud detection capabilities</li>
                <li>• Show the ZKP privacy-preserving verification</li>
                <li>• Demonstrate the complete transaction lifecycle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Technical Notes:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• All blockchain features are simulated for demo purposes</li>
                <li>• ZKP verification is visual simulation only</li>
                <li>• Security detection uses rule-based logic</li>
                <li>• Production would integrate real blockchain and ZKP protocols</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default DemoScriptPage;
