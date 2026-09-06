# Budget Buddy - API Reference

## Supabase Services

All API calls are organized in `src/services/api.ts`

### Authentication Service

```typescript
import { authService } from '@/services/api';

// Sign up new user
await authService.signUp(email, password, name);

// Sign in existing user
await authService.signIn(email, password);

// Sign out current user
await authService.signOut();

// Get current user
const user = await authService.getCurrentUser();

// Reset password
await authService.resetPassword(email);

// Update password
await authService.updatePassword(newPassword);
```

### Profile Service

```typescript
import { profileService } from '@/services/api';

// Create user profile
const profile = await profileService.createProfile(userId, name, role, avatarUrl);

// Get profile by ID
const profile = await profileService.getProfile(userId);

// Update profile
const updated = await profileService.updateProfile(userId, updates);

// Get partner profile
const partner = await profileService.getPartner(partnerId);

// Link profiles (couple pairing)
await profileService.linkPartner(userId, partnerId);
```

### Budget Service

```typescript
import { budgetService } from '@/services/api';

// Create new budget with categories
const budget = await budgetService.createBudget(
  providerId,
  amount,
  frequency,
  categories
);

// Get current active budget
const budget = await budgetService.getCurrentBudget(providerId);

// Get specific budget
const budget = await budgetService.getBudget(budgetId);

// Update budget spent amount
await budgetService.updateBudgetSpent(budgetId, amount);
```

### Category Service

```typescript
import { categoryService } from '@/services/api';

// Get all categories for a budget
const categories = await categoryService.getCategories(budgetId);

// Get specific category
const category = await categoryService.getCategory(categoryId);
```

### Request Service

```typescript
import { requestService } from '@/services/api';

// Create reimbursement request
const request = await requestService.createRequest(
  receiverId,
  budgetId,
  categoryId,
  amount,
  description,
  photoUrl
);

// Get all requests for budget
const requests = await requestService.getRequests(budgetId);

// Get pending requests
const pending = await requestService.getPendingRequests(budgetId);

// Approve request
await requestService.approveRequest(requestId, budgetId, amount, notes);

// Reject request
await requestService.rejectRequest(requestId, notes);

// Get receiver's requests
const requests = await requestService.getReceiverRequests(receiverId);
```

### Storage Service

```typescript
import { storageService } from '@/services/api';

// Upload photo
const url = await storageService.uploadPhoto(file, path);

// Delete photo
await storageService.deletePhoto(path);
```

### Notification Service

```typescript
import { notificationService } from '@/services/api';

// Get user notifications
const notifications = await notificationService.getNotifications(userId);

// Mark notification as read
await notificationService.markAsRead(notificationId);

// Create notification
await notificationService.createNotification(
  userId,
  type,
  title,
  message,
  relatedId
);
```

## Custom Hooks

### useAuth

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const {
    session,      // Current session
    user,         // Current user
    loading,      // Loading state
    signUp,       // Sign up function
    signIn,       // Sign in function
    signOut,      // Sign out function
    resetPassword // Reset password function
  } = useAuth();
};
```

### useTheme

```typescript
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const {
    isDark,       // Is dark mode enabled
    toggleTheme   // Toggle dark mode
  } = useTheme();
};
```

### useBudget

```typescript
import { useBudget } from '@/hooks/useBudget';

const MyComponent = () => {
  const {
    budget,           // Current budget
    isLoading,        // Loading state
    isError,          // Error state
    error,            // Error object
    refreshBudget     // Refresh budget function
  } = useBudget(providerId);
};
```

### useCreateBudget

```typescript
import { useCreateBudget } from '@/hooks/useBudget';

const MyComponent = () => {
  const mutation = useCreateBudget();
  
  await mutation.mutateAsync({
    providerId,
    amount,
    frequency,
    categories
  });
};
```

### useBudgetRequests

```typescript
import { useBudgetRequests } from '@/hooks/useRequests';

const MyComponent = () => {
  const {
    requests,     // All requests
    isLoading,    // Loading state
    isError,      // Error state
    error         // Error object
  } = useBudgetRequests(budgetId);
};
```

### usePendingRequests

```typescript
import { usePendingRequests } from '@/hooks/useRequests';

const MyComponent = () => {
  const {
    pendingRequests,  // Pending requests only
    isLoading,        // Loading state
    error             // Error object
  } = usePendingRequests(budgetId);
};
```

### useReceiverRequests

```typescript
import { useReceiverRequests } from '@/hooks/useRequests';

const MyComponent = () => {
  const {
    requests,     // Receiver's requests
    isLoading,    // Loading state
    error         // Error object
  } = useReceiverRequests(receiverId);
};
```

### useCreateRequest

```typescript
import { useCreateRequest } from '@/hooks/useRequests';

const MyComponent = () => {
  const mutation = useCreateRequest();
  
  await mutation.mutateAsync({
    receiverId,
    budgetId,
    categoryId,
    amount,
    description,
    photoUrl
  });
};
```

### useApproveRequest

```typescript
import { useApproveRequest } from '@/hooks/useRequests';

const MyComponent = () => {
  const mutation = useApproveRequest();
  
  await mutation.mutateAsync({
    requestId,
    budgetId,
    amount,
    notes
  });
};
```

### useRejectRequest

```typescript
import { useRejectRequest } from '@/hooks/useRequests';

const MyComponent = () => {
  const mutation = useRejectRequest();
  
  await mutation.mutateAsync(requestId);
};
```

### useUserProfile

```typescript
import { useUserProfile } from '@/hooks/useProfile';

const MyComponent = () => {
  const {
    profile,      // User's profile
    isLoading,    // Loading state
    error         // Error object
  } = useUserProfile();
};
```

### usePartnerProfile

```typescript
import { usePartnerProfile } from '@/hooks/useProfile';

const MyComponent = () => {
  const {
    partner,      // Partner's profile
    isLoading,    // Loading state
    error         // Error object
  } = usePartnerProfile(partnerId);
};
```

## Global State (Zustand)

```typescript
import { useAppStore } from '@/store/appStore';

const MyComponent = () => {
  const {
    // User
    currentUser,
    setCurrentUser,
    
    // Budget
    currentBudget,
    setCurrentBudget,
    
    // Requests
    requests,
    setRequests,
    addRequest,
    updateRequest,
    
    // Notifications
    notifications,
    setNotifications,
    addNotification,
    markNotificationAsRead,
    
    // UI
    isDarkMode,
    toggleDarkMode,
    isLoading,
    setIsLoading,
    
    // Reset
    reset
  } = useAppStore();
};
```

## Validation Schemas

```typescript
import {
  SignUpSchema,
  SignInSchema,
  ProfileSetupSchema,
  BudgetSetupSchema,
  CategorySchema,
  ReimbursementRequestSchema,
  PartnerInviteSchema,
  PairingCodeSchema
} from '@/utils/validation';

// Use with react-hook-form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(SignUpSchema)
});
```

## Formatting Utilities

```typescript
import {
  formatCurrency,      // $1,234.56
  formatDate,          // Jan 15, 2024
  formatTime,          // 2:30 PM
  formatDateTime,      // Jan 15, 2024 2:30 PM
  getRelativeTime,     // 2 hours ago
  calculatePercentage, // 45
  getDaysRemaining,    // 15
  getBudgetStatus,     // 'safe' | 'warning' | 'danger'
  formatFileSize,      // 2.5 MB
  compressImage,       // Compress image blob
  generatePairingCode  // 'ABC123'
} from '@/utils/formatting';
```

## Storage Utilities

```typescript
import {
  initializeDB,
  saveToCache,
  getFromCache,
  clearCache,
  saveUserPreference,
  getUserPreference,
  removeUserPreference,
  clearUserPreferences
} from '@/utils/storage';

// IndexedDB operations
await saveToCache('requests', requestsData);
const cached = await getFromCache('requests');

// LocalStorage operations
saveUserPreference('theme', 'dark');
const theme = getUserPreference('theme');
```

## Component Props

### BudgetOverview
```typescript
interface BudgetOverviewProps {
  budget: Budget;
}
```

### RequestCard
```typescript
interface RequestCardProps {
  request: ReimbursementRequest;
  category?: Category;
  onApprove?: () => void;
  onReject?: () => void;
  isProvider?: boolean;
}
```

### RequestForm
```typescript
interface RequestFormProps {
  budget: Budget;
  categories: Category[];
  onSubmit: (data: ReimbursementRequestData & { photoUrl?: string }) => Promise<void>;
  isLoading?: boolean;
}
```

### RequestList
```typescript
interface RequestListProps {
  requests: ReimbursementRequest[];
  categories: Category[];
  isLoading?: boolean;
  onApprove?: (requestId: string, budgetId: string, amount: number) => Promise<void>;
  onReject?: (requestId: string) => Promise<void>;
  isProvider?: boolean;
  filter?: 'all' | 'pending' | 'approved' | 'rejected';
}
```

### AnalyticsDashboard
```typescript
interface AnalyticsDashboardProps {
  requests: ReimbursementRequest[];
  categories: Category[];
}
```

### Alert
```typescript
interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}
```

## Type Definitions

All TypeScript types are in `src/types/index.ts`:

```typescript
interface User { }
interface Budget { }
interface Category { }
interface ReimbursementRequest { }
interface Transaction { }
interface PairingCode { }
interface Notification { }
interface FormData { }
```

## Error Handling

All API calls throw errors that should be caught:

```typescript
try {
  const result = await apiService.doSomething();
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Unknown error';
  toast.error(message);
}
```

Use `react-hot-toast` for notifications:

```typescript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

## Database Subscriptions (Real-time)

```typescript
import { supabase } from '@/services/supabase';

const subscription = supabase
  .from('requests')
  .on('*', (payload) => {
    console.log('Change:', payload);
  })
  .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

---

For more information, see the documentation in the `docs/` folder.
