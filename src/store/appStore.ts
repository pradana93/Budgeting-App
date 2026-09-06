import { create } from 'zustand';
import { User, Budget, ReimbursementRequest, Notification } from '@/types';

interface AppStore {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Budget
  currentBudget: Budget | null;
  setCurrentBudget: (budget: Budget | null) => void;

  // Requests
  requests: ReimbursementRequest[];
  setRequests: (requests: ReimbursementRequest[]) => void;
  addRequest: (request: ReimbursementRequest) => void;
  updateRequest: (request: ReimbursementRequest) => void;

  // Notifications
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;

  // UI State
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Reset
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => {
  // Load dark mode preference
  const savedDarkMode =
    typeof window !== 'undefined'
      ? localStorage.getItem('darkMode') === 'true'
      : false;

  return {
    // User
    currentUser: null,
    setCurrentUser: (user) => set({ currentUser: user }),

    // Budget
    currentBudget: null,
    setCurrentBudget: (budget) => set({ currentBudget: budget }),

    // Requests
    requests: [],
    setRequests: (requests) => set({ requests }),
    addRequest: (request) =>
      set((state) => ({
        requests: [request, ...state.requests],
      })),
    updateRequest: (request) =>
      set((state) => ({
        requests: state.requests.map((r) => (r.id === request.id ? request : r)),
      })),

    // Notifications
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    addNotification: (notification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
    markNotificationAsRead: (id) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),

    // UI State
    isDarkMode: savedDarkMode,
    toggleDarkMode: () =>
      set((state) => {
        const newDarkMode = !state.isDarkMode;
        localStorage.setItem('darkMode', String(newDarkMode));
        return { isDarkMode: newDarkMode };
      }),
    isLoading: false,
    setIsLoading: (loading) => set({ isLoading: loading }),

    // Reset
    reset: () =>
      set({
        currentUser: null,
        currentBudget: null,
        requests: [],
        notifications: [],
        isLoading: false,
      }),
  };
});
