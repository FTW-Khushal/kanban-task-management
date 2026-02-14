# 🏆 The Ultimate Kanban Experience (AI-Powered)

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](http://kanbanapp.net/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Experience it Live: [kanbanapp.net](http://kanbanapp.net/)**

Welcome to a masterclass in modern web engineering. This isn't just another Kanban board; it's a high-performance, **AI-integrated workspace management system** engineered for speed, responsiveness, and a flawless user experience. Built with the bleeding-edge stack of **Next.js 15** and **React 19**, it sets a new standard for what a web application can be.

---

## 🚀 Why This Project Stands Out

### 🤖 Next-Gen AI Management Bridge
Stop clicking, start commanding. This project features a sophisticated **Natural Language Processing (NLP)** bridge that translates complex human intent into precise system actions.
- **Context-Aware Commands**: "Move my urgent marketing tasks to the 'High Priority' column."
- **Automated Workflow Creation**: "Generate a new board for a 2-week Sprint with Todo, In Progress, Peer Review, and Done columns."
- **Zero-Latency Feedback**: AI actions are immediately reflected on the UI with elegant visual highlights.

### 🎯 Enterprise-Grade Kanban Engine
Built on top of a rock-solid Drag & Drop architecture, the Kanban engine handles complex state transitions with ease.
- **Fluid Interactions**: Powered by `@hello-pangea/dnd` for butter-smooth movement.
- **Optimistic Everything**: We don't wait for the server. Every action—moving tasks, toggling subtasks, renaming boards—is reflected instantly, ensuring a zero-lag user experience.
- **Dynamic Workspaces**: Scale from a single Todo list to enterprise-level project tracking with unlimited boards and columns.

### 💎 Premium Glassmorphic Design
Aesthetics meet functionality. The UI is a custom-crafted masterpiece featuring:
- **Responsive Mastery**: A first-class experience on everything from a 4K monitor to a mobile device.
- **Micro-Animations**: Subtle, purposeful animations powered by `Framer Motion` that make the app feel alive.
- **Refined Dark/Light Themes**: Pixel-perfect color palettes designed for long-form focus and visual comfort.

---

## 🛠️ The Powerhouse Stack

| Layer | Technology | Why it's here |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) | App Router for blazing-fast performance and SEO. |
| **UI Library** | [React 19](https://react.dev/) | Utilizing the latest React features for efficient rendering. |
| **Styling** | [Tailwind CSS 4.0](https://tailwindcss.com/) | The latest in utility-first design systems. |
| **State** | [TanStack Query v5](https://tanstack.com/query) | Robust server-state management and sync. |
| **Primitives** | [Radix UI](https://www.radix-ui.com/) | Unstyled, accessible components as a foundation. |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Cinematic transitions and interactions. |

---

## 🧠 Behind the Scenes: The AI Bridge

The core innovation lies in `lib/chat-bridge.ts`. It's a robust mapping layer that connects an LLM (Large Language Model) to the application context. It's not just a chatbot; it's a **functional interface** that understands types, board IDs, and column relationships to perform surgery on your data in real-time.

---

## 🛠️ Local Development & Setup

If you want to run this powerhouse locally:

1. **Clone with Intent**:
   ```bash
   git clone https://github.com/FTW-Khushal/kanban-task-management.git
   cd kanban-task-management
   ```

2. **Fuel the Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Engine**:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Ignite the Server**:
   ```bash
   npm run dev
   ```

---

Built with passion and technical excellence by [Khushal](https://github.com/FTW-Khushal). Check it out live at **[kanbanapp.net](http://kanbanapp.net/)**.
