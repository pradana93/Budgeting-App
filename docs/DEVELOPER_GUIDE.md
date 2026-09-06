# Budget Buddy - Developer Guide

## Project Overview

Budget Buddy is a full-stack React + Supabase application for couples to manage shared budgets and track reimbursement requests.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with Functional Components & Hooks
- **Router**: React Router v6
- **State Management**: Zustand (global state) + React Query (server state)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **UI Components**: Lucide React icons

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth (Email/Password)
- **Storage**: Supabase Storage (for receipt photos)
- **Realtime**: Supabase Realtime subscriptions
- **Functions**: Edge Functions (optional)

## Folder Structure

```
src/
├── components/
│   ├── common/              # Reusable components
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── Alert.tsx
│   ├── setup-wizard/        # Onboarding flow
│   │   ├── SetupWizard.tsx
│   │   ├── ProfileStep.tsx
│   │   ├── BudgetStep.tsx
│   │   └── PartnerStep.tsx
│   ├── dashboard/           # Dashboard pages
│   │   ├── ProviderDashboard.tsx
│   │   ├── ReceiverDashboard.tsx
│   │   └── BudgetOverview.tsx
│   ├── requests/            # Request management
│   │   ├── RequestForm.tsx
│   │   ├── RequestList.tsx
│   │   └── RequestCard.tsx
│   └── analytics/           # Reporting
│       └── AnalyticsDashboard.tsx
├── contexts/                # React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── useBudget.ts
│   ├── useRequests.ts
│   └── useProfile.ts
├── services/                # API calls
│   ├── supabase.ts         # Supabase client
│   └── api.ts              # API functions
├── store/                   # Zustand store
│   └── appStore.ts
├── types/                   # TypeScript types
│   └── index.ts
├── utils/                   # Utilities
│   ├── validation.ts       # Zod schemas
│   ├── formatting.ts       # Format & helper functions
│   └── storage.ts          # Local storage & IndexedDB
├── pages/                   # Page components
│   └── Auth.tsx
├── App.tsx                  # Main app
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## Development Workflow

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Database
Follow `docs/SUPABASE_SETUP.md` to create the database schema in Supabase.

### 4. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Key Features

### Authentication
- Sign up with email/password
- Sign in with email/password
- Protected routes with auth state
- Profile creation on signup

### Budget Management
- Create monthly/weekly/bi-weekly budgets
- Define spending categories with limits
- Track spending in real-time
- Visual progress bars and status indicators

### Request Management
- Submit reimbursement requests with photos
- Approve/reject requests with notes
- Filter requests by status
- Upload and compress images

### Analytics
- Spending distribution pie chart
- Monthly spending trends
- Category spending analysis
- Budget vs. actual comparison

### Notifications
- Real-time notifications for requests
- Budget low warnings
- Request status updates

## Common Tasks

### Adding a New Page
1. Create file in `src/pages/YourPage.tsx`
2. Add route in `App.tsx`
3. Import components as needed

### Creating a Component
1. Create folder in `src/components/`
2. Export from index file if needed
3. Use TypeScript interfaces for props

### Adding an API Call
1. Add function to `src/services/api.ts`
2. Create custom hook in `src/hooks/`
3. Use hook in component with React Query

### Form Validation
1. Define Zod schema in `src/utils/validation.ts`
2. Use `useForm` with `zodResolver`
3. Display error messages from form state

## Styling

### Tailwind CSS
- Responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode: `dark:` prefix
- Reusable classes in `index.css` (`.card`, `.btn-primary`, etc.)

### Custom Classes
```css
.card {
  @apply bg-white dark:bg-slate-800 rounded-lg shadow-md p-6;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg;
}
```

## Supabase Integration

### Authentication
```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, signOut } = useAuth();
  return <div>{user?.email}</div>;
};
```

### Database Queries
```typescript
import { budgetService } from '@/services/api';

const budget = await budgetService.getCurrentBudget(userId);
```

### Real-time Subscriptions
```typescript
supabase
  .from('requests')
  .on('*', (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## Testing

### Run Tests
```bash
npm run test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Building for Production

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## Performance Optimization

1. **Code Splitting**: React Router automatically splits routes
2. **Lazy Loading**: Use React.lazy() for heavy components
3. **Image Compression**: `compressImage()` in `utils/formatting.ts`
4. **Query Caching**: React Query caches data with configurable stale time
5. **Memoization**: Use React.memo for expensive components

## Security Best Practices

1. **Environment Variables**: Never expose Supabase keys in code
2. **RLS Policies**: Row Level Security enforces data access
3. **Password Hashing**: Supabase handles password hashing
4. **XSS Protection**: React escapes content by default
5. **HTTPS Only**: Always use HTTPS in production

## Troubleshooting

### Issue: "User not authenticated"
- Check that auth context is initialized
- Verify Supabase credentials in `.env.local`
- Check browser console for errors

### Issue: "RLS policy denied"
- Make sure user is logged in
- Check RLS policies in Supabase
- Verify user has access to the resource

### Issue: "Photos not uploading"
- Check storage bucket exists
- Verify storage policies are set
- Check file size (max 10MB)

### Issue: "Slow performance"
- Check React Query cache settings
- Enable code splitting
- Compress images before upload
- Check browser dev tools for bottlenecks

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest)
- [Supabase Docs](https://supabase.com/docs)
- [Zod Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)

## Support

For issues or questions:
1. Check the docs folder
2. Review Supabase documentation
3. Check browser console for errors
4. Review component prop types

## License

MIT
