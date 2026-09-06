# 🚀 Budget Buddy - Getting Started

Welcome to Budget Buddy! This guide will help you get the application up and running.

## 📋 Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free at supabase.com)
- A code editor (VS Code recommended)

## 🏗️ Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd "Budgeting App"
npm install
```

### Step 2: Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **SQL Editor** and run the queries from `docs/database-schema.sql`
4. Create a storage bucket named `request-photos`
5. Copy your project URL and anon key

### Step 3: Configure Environment
Create `.env.local` in the root directory:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Start Development Server
```bash
npm run dev
```

The app opens at `http://localhost:5173`

### Step 5: Test the App
1. **Sign Up** with your email and password
2. **Complete Setup Wizard**:
   - Enter your name and choose a role (Provider or Receiver)
   - Set up your budget and categories
   - Optionally invite your partner
3. **Explore the Dashboard**:
   - View budget status
   - Submit or approve requests
   - Check analytics

## 📁 Project Structure

```
Budgeting App/
├── src/
│   ├── components/           # React components
│   ├── contexts/             # React contexts (Auth, Theme)
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # API & Supabase integration
│   ├── store/                # Zustand state management
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── docs/
│   ├── database-schema.sql   # Database setup
│   ├── SUPABASE_SETUP.md     # Supabase guide
│   └── DEVELOPER_GUIDE.md    # Development guide
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── README.md                 # This file
```

## 🔑 Key Features

### 👤 User Roles

**Provider Role**:
- Sets the budget amount and categories
- Reviews and approves/rejects reimbursement requests
- Views spending analytics and trends
- Manages the couple's overall budget

**Receiver Role**:
- Submits reimbursement requests with photos
- Tracks remaining budget
- Views request history and status
- Receives notifications on request decisions

### 💰 Budget Management
- Set weekly, bi-weekly, or monthly budgets
- Define custom spending categories
- Set category spending limits
- Track real-time spending
- Visual progress indicators

### 📸 Request Management
- Submit reimbursement requests with receipt photos
- Image compression for faster uploads
- Photo viewing and approval flow
- Rejection reasons and notes
- Request history and filtering

### 📊 Analytics & Reports
- Spending distribution pie charts
- Monthly spending trends
- Category spending analysis
- Budget vs. actual comparison

### 🔔 Notifications
- Real-time request notifications
- Budget status alerts
- Request approval/rejection updates

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📚 Documentation

- **`docs/SUPABASE_SETUP.md`** - Detailed Supabase configuration guide
- **`docs/database-schema.sql`** - Database schema and RLS policies
- **`docs/DEVELOPER_GUIDE.md`** - Development workflow and architecture

## 🎯 User Flow

### First-Time Setup
1. User signs up with email/password
2. Enters name and selects role (Provider/Receiver)
3. Sets budget amount and frequency (if Provider)
4. Chooses spending categories
5. Optionally invites partner
6. Redirected to appropriate dashboard

### Daily Usage (Provider)
1. View budget overview with remaining amount
2. Check pending reimbursement requests
3. Approve or reject requests
4. View analytics and spending trends

### Daily Usage (Receiver)
1. View remaining budget
2. Submit reimbursement request with photo
3. Track request status
4. View request history

## 🔐 Security Features

- **Row Level Security (RLS)**: Database data isolated per couple
- **Supabase Auth**: Secure email/password authentication
- **Encrypted Storage**: Photos stored securely
- **Environment Variables**: Sensitive data never exposed
- **HTTPS Only**: All communications encrypted

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables
4. Netlify auto-deploys on push

### Deploy to Heroku
```bash
heroku create
heroku config:set VITE_SUPABASE_URL=...
heroku config:set VITE_SUPABASE_ANON_KEY=...
git push heroku main
```

## 🐛 Troubleshooting

### "Cannot find module '@/...'"
- Make sure path aliases are configured in `tsconfig.json`
- Restart development server

### "RLS policy violation"
- Ensure you're logged in
- Check RLS policies in Supabase dashboard
- Verify user has access to resource

### "Storage error uploading photo"
- Check storage bucket exists and is private
- Verify storage policies are set
- Check file size (max 10MB)

### "Slow performance"
- Check React Query cache settings
- Use browser DevTools to profile
- Compress images before upload
- Enable code splitting

## 💡 Tips & Best Practices

1. **Test Locally First**: Always test new features locally before deploying
2. **Use TypeScript**: Take advantage of type safety for fewer bugs
3. **Follow Folder Structure**: Keep components organized by feature
4. **Reuse Components**: Create composable, reusable components
5. **Handle Loading States**: Always show loading spinners for async operations
6. **Test Error Cases**: Don't just test the happy path
7. **Optimize Images**: Always compress images before uploading
8. **Monitor Performance**: Use browser DevTools to check performance

## 🤝 Contributing

To contribute:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Create a pull request
5. Request review

## 📞 Support

- Check documentation in `docs/` folder
- Review Supabase documentation
- Check browser console for errors
- Review component prop types and interfaces

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

## 📄 License

MIT License - feel free to use this project for personal or commercial use.

## 🎉 Next Steps

1. ✅ Install dependencies
2. ✅ Set up Supabase
3. ✅ Configure `.env.local`
4. ✅ Run `npm run dev`
5. ✅ Test the app
6. ✅ Deploy to production

Happy budgeting! 💰
