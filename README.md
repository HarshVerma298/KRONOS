# 🔥 KRONOS — Web3 Quest Assistant

**Project URL:** https://lovable.dev/projects/a82f2979-c3a3-45a1-8c4b-d7448fbe82de

KRONOS is a Web3-focused quest and AI assistant that helps users verify on-chain activity (like Uniswap swaps) and interact with an AI-powered assistant. Users can optionally receive on-chain rewards (PYUSD) when configured securely. Built with React, Vite, ethers.js, Supabase, and Groq/AI.

---

## 🎯 Overview

KRONOS prioritizes wallet activity and Web3 onboarding. Users can:

- Verify on-chain quests (e.g., Uniswap swaps) directly from the browser.
- Get summarized wallet activity via AI, highlighting recent transactions.
- Receive on-chain micro-rewards safely via PYUSD (optional, requires secure server-side keys).

This solution demonstrates how Blockscout can provide reliable on-chain verification, while PayPal’s PYUSD allows seamless educational incentives.

---

## ✨ Key Features

- **🔗 On-chain quest verification**: Check user activity directly from their wallet.
- **🤖 AI assistant**: Summarizes wallet transactions and highlights trends.
- **💼 Wallet support**: Works with MetaMask and Ethereum Sepolia Testnet.
- **🏦 Rewards helper**: Sends PYUSD securely (requires server-side key storage).
- **🛠️ Modern UI**: Built with React, Vite, Tailwind CSS, and shadcn-ui.

---

## 🏗️ Architecture

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Frontend │ │ Supabase │ │ AI / Groq │
│ (React + TS) │◄───►│ Auth & DB │◄───►│ Transaction │
│ • Wallet Conn │ │ • Edge Funcs │ │ Summarization │
│ • Quest Verify │ │ • Rewards Sec. │ │ │
└─────────────────┘ └─────────────────┘ └─────────────────┘
│ │
▼ ▼
┌────────────────────────────┐
│ On-chain helpers (ethers.js)│
│ - Fetch tx history │
│ - Verify swaps │
│ - Send PYUSD rewards │
└────────────────────────────┘
```


---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, shadcn-ui  
- **Blockchain**: Ethereum Sepolia Testnet, ethers.js  
- **Wallets**: MetaMask  
- **Backend & DB**: Supabase (auth, Edge Functions, database)  
- **AI / LLM**: Groq / AI for transaction summarization  

---

## 🚀 Quick Start — Run Locally

### Prerequisites

- Node.js 16+ and npm or pnpm
- A Supabase project (if you want auth/DB/functions)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/kronos.git
cd kronos
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables- .env file
create a .env file in the main folder.
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# AI / Groq
VITE_GROQ_API_KEY=your-groq-api-key

# Treasury key (server-side only!)
VITE_TREASURY_PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

### 4. Run dev server
```bash
npm run dev
```

## Project structure (repo tree)

Below is a concise diagram of this repository's top-level structure and important subfolders.

```
kronos-quest-ai/
├─ .gitignore
├─ README.md
├─ package.json
├─ package-lock.json
├─ bun.lockb
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ postcss.config.js
├─ tailwind.config.ts
├─ eslint.config.js
├─ components.json
├─ public/
│  ├─ favicon.ico
│  ├─ placeholder.svg
│  └─ robots.txt
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ App.css
│  ├─ index.css
│  ├─ vite-env.d.ts
│  ├─ pages/
│  │  ├─ Index.tsx
│  │  └─ NotFound.tsx
│  ├─ components/
│  │  ├─ AIChat.tsx
│  │  ├─ Features.tsx
│  │  ├─ Hero.tsx
│  │  ├─ QuestDashboard.tsx
│  │  └─ TechStack.tsx
│  ├─ components/ui/   (many shadcn-ui components)
│  │  └─ ... (accordion, button, card, tooltip, toast, etc.)
│  ├─ hooks/
│  │  ├─ use-mobile.tsx
│  │  ├─ use-toast.ts
│  │  └─ useWallet.ts
│  ├─ integrations/
│  │  └─ supabase/
│  │     ├─ client.ts
│  │     └─ types.ts
│  └─ lib/
│     ├─ kronos.ts      (on-chain logic, AI integration)
│     └─ utils.ts
├─ supabase/
│  ├─ config.toml
│  └─ functions/
│     ├─ ai-chat/index.ts
│     ├─ send-reward/index.ts
│     └─ verify-quest/index.ts
└─ PROJECT_STRUCTURE.md   (this file)

```

Short notes

- `src/` — main frontend source. UI lives under `components/` and the design system components are in `components/ui/`.
- `src/integrations/supabase/` — Supabase client and types used by the frontend.
- `src/lib/kronos.ts` — important: contains AI/chain helpers and references env vars (see README for exact names).
- `supabase/functions/` — server-side functions (preferred place for sensitive logic like reward sending).
- `public/` — static assets for the site.


## Implementation Details
- AI assistant: Summarizes recent transactions, highlights incoming/outgoing activity, and prioritizes wallet activity.

- Quest verification: Uses Blockscout API and ethers.js to verify actions like Uniswap swaps.

- Reward sending: Uses ethers.js to transfer PYUSD tokens securely. Key must be stored server-side.

- Frontend: React + Tailwind CSS for responsive and smooth UI.

## 🤝 Contributing
- Fork the repository

- Create a branch

- Implement features or fixes

- Open a pull request

- Never commit secrets


## 📄 License

MIT License — see LICENSE file.


Built with ❤️ for Eth Global Online Hackathon.
