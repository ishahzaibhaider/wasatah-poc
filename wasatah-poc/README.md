# Wasatah.app - Blockchain + AI Real Estate PoC

A fully functional proof-of-concept demonstrating a blockchain-powered real estate platform with NAFTA-style identity verification, digital ID issuance, buyer-seller-broker roles, impersonation detection, ZKP-like proof tags, and a complete blockchain explorer. **Now deployed and fully functional with browser-based storage!**

🌐 **Live Demo:** [https://wasatah-poc.netlify.app](https://wasatah-poc.netlify.app)

## 🏗️ Project Structure

```
wasatah-poc/
├── apps/
│   ├── web/          # React + TypeScript + Vite + Tailwind + Router + Zustand
│   └── dev-api/      # Node 20 + Express 4 API server (in-memory storage)
├── package.json      # Root package.json with npm workspaces
└── README.md
```

## 🚀 Quick Start

### 🌐 **Live Demo (Recommended)**
Visit the deployed demo: **[https://wasatah-poc.netlify.app](https://wasatah-poc.netlify.app)**

### 🛠️ **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm run dev --workspace=apps/web

# Open http://localhost:5173
```

### 📱 **Mobile-Friendly Demo**
The demo works perfectly on mobile devices and tablets for investor presentations.

### 🔄 **Demo Reset**
Use the "Reset Demo" button in the top navigation to clear all data and start fresh.

## 📱 Web Application (apps/web)

### **Technology Stack**
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **State Management:** Zustand with browser storage persistence
- **Storage:** Browser localStorage (no backend required)
- **Deployment:** Netlify with automatic builds

### **Pages & Routes**
- **`/`** – Landing page with demo introduction
- **`/login`** – User authentication (creates demo users)
- **`/role`** – Role selection (Buyer/Seller/Broker)
- **`/buyer`** – Buyer dashboard with property viewing and offer creation
- **`/seller`** – Seller dashboard with offer management and transaction completion
- **`/broker`** – Broker dashboard with impersonation detection demo
- **`/explorer`** – Blockchain explorer showing all events
- **`/about-zk`** – Educational content about Zero-Knowledge Proofs
- **`/demo-script`** – Step-by-step demo guide for investors

### **Key Features**
- ✅ **Complete user authentication** with digital ID simulation
- ✅ **Full offer lifecycle** (create → pending → accept/decline → complete)
- ✅ **Blockchain event tracking** with signatures and hashes
- ✅ **Role-based dashboards** with tailored functionality
- ✅ **Impersonation detection** with security alerts
- ✅ **Mobile-responsive design** for presentations

## 🔧 Development API (apps/dev-api)

**Note:** The development API is now optional. The main demo uses browser storage for a seamless experience.

- Express 4 + TypeScript
- Routes mounted under `/api`: `ledger`, `users`, `properties`, `offers`
- Health: `GET /health`
- Ledger: `GET /api/ledger`, `POST /api/ledger/append`, `POST /api/ledger/reset`
- Users/Properties/Offers: full CRUD and filtered list endpoints
- Storage: in-memory database fallback in `src/config/database.ts` (data resets on restart)

## 🎯 Complete Demo Flow

### **For Investors (5-minute demo):**
1. **Visit:** [https://wasatah-poc.netlify.app](https://wasatah-poc.netlify.app)
2. **Sign up/Login** → Create demo user with digital ID
3. **Select Role** → Choose Buyer, Seller, or Broker
4. **As Buyer:** Browse property → Make offer → Check "My Offers"
5. **As Seller:** Review offers → Accept/Decline → Complete transaction
6. **As Broker:** Trigger impersonation detection → View security alerts
7. **Blockchain Explorer** → See all events with signatures and hashes
8. **Reset Demo** → Clear data for next presentation

### **Key Demo Points:**
- ✅ **Zero infrastructure** - Works instantly in any browser
- ✅ **Complete transaction flow** - From offer to ownership transfer
- ✅ **Blockchain simulation** - All events tracked with cryptographic signatures
- ✅ **Security features** - Impersonation detection and risk assessment
- ✅ **Mobile-friendly** - Perfect for tablet presentations

## 🛠️ Development Commands

```bash
# Root
npm install           # Install all dependencies
npm run dev           # Start web development server
npm run build         # Build for production
npm run lint          # Lint all workspaces
npm run format        # Prettier write

# Web App
npm run dev --workspace=apps/web     # Start dev server (http://localhost:5173)
npm run build --workspace=apps/web   # Build for production
npm run preview --workspace=apps/web # Preview production build

# API (Optional)
npm run dev --workspace=apps/dev-api # Start API server (http://localhost:3001)
npm run setup --workspace=apps/dev-api
npm run reset --workspace=apps/dev-api
```

## 📋 Key Features

### 🔐 **Identity & Digital ID System**
- **NAFTA-style verification** simulation with risk scoring
- **Digital ID issuance** with verification status and expiration
- **ZKP-like proof tags** on all blockchain events (visual simulation)
- **Risk assessment** with impersonation detection alerts

### 👥 **Role-Based Experience**
- **Buyer Dashboard:** Property browsing, offer creation, offer tracking
- **Seller Dashboard:** Offer management, accept/decline, transaction completion
- **Broker Dashboard:** Impersonation detection demo, security monitoring

### ⛓️ **Blockchain Explorer**
- **Complete event tracking** with cryptographic signatures
- **SHA-256 hashing** of all event payloads
- **Event types:** user registration, offer creation, acceptance, transaction completion
- **Real-time updates** as users interact with the platform

### 🛡️ **Security Features**
- **Impersonation detection** with risk banners and alerts
- **Transaction verification** with pseudo-signatures
- **Audit trail** of all platform activities
- **Risk scoring** for user verification levels

## 🔒 Security & Data Notes

- **This is a PoC** - No real authentication, KYC, or blockchain integration
- **Browser storage** - All data persists in localStorage for demo purposes
- **No sensitive data** - All user information is synthetic demo data
- **Production ready** - Architecture supports real backend integration when needed

## 📚 Documentation

- **`PROJECT_BRIEF.md`** – Original project requirements and vision
- **`IMPLEMENTATION_PLAN.md`** – Development phases and roadmap
- **`apps/dev-api/README.md`** – API setup and endpoints (optional)
- **`apps/web/README.md`** – Web app development guide

## 🚀 Deployment

### **Netlify (Current)**
- **URL:** [https://wasatah-poc.netlify.app](https://wasatah-poc.netlify.app)
- **Auto-deploy:** Pushes to main branch trigger automatic builds
- **Configuration:** `netlify.toml` handles build settings and redirects

### **Alternative Deployments**
- **Vercel:** Compatible with current build setup
- **GitHub Pages:** Static build works with any static hosting
- **AWS S3 + CloudFront:** For enterprise deployments

---

## ✅ **Current Status: PRODUCTION READY**

**🎯 Fully functional demo** with complete user flows, blockchain simulation, and investor-ready presentation capabilities. Perfect for showcasing the future of real estate transactions powered by blockchain technology.

**📱 Mobile-optimized** for tablet presentations and investor meetings.

**🔄 Zero maintenance** - Browser storage means no database management or server costs.
