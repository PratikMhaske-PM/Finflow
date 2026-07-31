# FinFlow - Personal Finance Management System

FinFlow is a comprehensive, production-ready MERN stack web application built for individuals who want complete control over their finances. 

## Features

- **Authentication:** Secure JWT-based Login/Register/Logout.
- **Dashboard:** At-a-glance financial summary, Total Net Worth, Income/Expense tracking.
- **Visualizations:** Beautiful interactive charts powered by Recharts (Area, Pie charts).
- **Incomes & Expenses:** Full CRUD operations categorized and sorted.
- **Budgets:** Set spending limits per category (Weekly/Monthly) and track progress dynamically.
- **Wallets:** Track balances across multiple accounts (Cash, Bank, Credit Cards).
- **Savings Goals:** Set target amounts with deadlines and monitor your progress.
- **Dark Mode:** Elegant light and dark themes using pure CSS variables.
- **Responsive:** Fluid layout using Flexbox and CSS Grid.

## Tech Stack
- **Frontend:** React, Vite, React Router DOM, Zustand (State Management), Axios, Recharts, Framer Motion, Lucide React, Plain CSS.
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, Bcrypt.

## Installation & Setup

1. **Clone and navigate to the project directory:**
   \`\`\`bash
   # Make sure you have Node and MongoDB installed.
   \`\`\`

2. **Backend Setup:**
   \`\`\`bash
   cd backend
   npm install
   # Make sure your MongoDB service is running on mongodb://localhost:27017/finflow 
   # or update the .env file with your Atlas URI.
   npm run dev
   \`\`\`
   
3. **Frontend Setup:**
   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`

4. Open your browser and navigate to \`http://localhost:5173\`.

## API Documentation

- **Auth:** \`/api/auth/register\`, \`/api/auth/login\`, \`/api/auth/profile\`
- **Incomes:** \`/api/incomes\` (GET, POST, DELETE)
- **Expenses:** \`/api/expenses\` (GET, POST, DELETE)
- **Budgets:** \`/api/budgets\` (GET, POST, DELETE)
- **Wallets:** \`/api/wallets\` (GET, POST, DELETE)
- **Goals:** \`/api/goals\` (GET, POST, DELETE)

*Note: All feature endpoints (except login/register) require a valid Bearer Token.*

---
*Developed as a massive full-stack SaaS application iteration.*
