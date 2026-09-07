import { supabase } from './supabase';
import { User, Budget, ReimbursementRequest, Category, Notification } from '@/types';

// ...existing code...
export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};

// User Profile Service
export const profileService = {
  async createProfile(userId: string, name: string, role: 'provider' | 'receiver', avatarUrl?: string) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name,
        role,
        avatar_url: avatarUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as User;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async getPartner(partnerId: string) {
    return profileService.getProfile(partnerId);
  },

  async linkPartner(userId: string, partnerId: string) {
    const { error: error1 } = await supabase
      .from('profiles')
      .update({ partner_id: partnerId })
      .eq('id', userId);

    const { error: error2 } = await supabase
      .from('profiles')
      .update({ partner_id: userId })
      .eq('id', partnerId);

    if (error1 || error2) throw error1 || error2;
  },
};

// Budget Service
export const budgetService = {
  async createBudget(
    providerId: string,
    amount: number,
    frequency: 'weekly' | 'biweekly' | 'monthly',
    categories: Omit<Category, 'id' | 'budget_id' | 'created_at'>[]
  ) {
    const periodStart = new Date();
    const periodEnd = new Date();

    if (frequency === 'weekly') {
      periodEnd.setDate(periodEnd.getDate() + 7);
    } else if (frequency === 'biweekly') {
      periodEnd.setDate(periodEnd.getDate() + 14);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    const { data: budget, error: budgetError } = await supabase
      .from('budgets')
      .insert({
        provider_id: providerId,
        amount,
        frequency,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
      })
      .select()
      .single();

    if (budgetError) throw budgetError;

    // Insert categories
    const categoriesWithBudgetId = categories.map(cat => ({
      ...cat,
      budget_id: budget.id,
    }));

    const { error: catError } = await supabase
      .from('categories')
      .insert(categoriesWithBudgetId);

    if (catError) throw catError;

    return budget as Budget;
  },

  async getCurrentBudget(providerId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('provider_id', providerId)
      .gt('period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as Budget | null;
  },

  async getBudget(budgetId: string) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .single();

    if (error) throw error;
    return data as Budget;
  },

  async updateBudgetSpent(budgetId: string, amount: number) {
    const { data: budget } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .single();
    
    if (!budget) throw new Error('Budget not found');
    
    const newSpent = (budget.spent || 0) + amount;

    const { error } = await supabase
      .from('budgets')
      .update({ spent: newSpent, remaining: budget.amount - newSpent })
      .eq('id', budgetId);

    if (error) throw error;
  },
};

// Category Service
export const categoryService = {
  async getCategories(budgetId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('budget_id', budgetId);

    if (error) throw error;
    return data as Category[];
  },

  async getCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) throw error;
    return data as Category;
  },
};

// Request Service
export const requestService = {
  async createRequest(
    receiverId: string,
    budgetId: string,
    categoryId: string,
    amount: number,
    description: string,
    photoUrl?: string
  ) {
    const { data, error } = await supabase
      .from('requests')
      .insert({
        receiver_id: receiverId,
        budget_id: budgetId,
        category_id: categoryId,
        amount,
        description,
        photo_url: photoUrl,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return data as ReimbursementRequest;
  },

  async getRequests(budgetId: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('budget_id', budgetId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ReimbursementRequest[];
  },

  async getPendingRequests(budgetId: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('budget_id', budgetId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ReimbursementRequest[];
  },

  async approveRequest(requestId: string, budgetId: string, amount: number, notes?: string) {
    const { error } = await supabase
      .from('requests')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        notes,
      })
      .eq('id', requestId);

    if (error) throw error;

    // Update budget spent
    await budgetService.updateBudgetSpent(budgetId, amount);
  },

  async rejectRequest(requestId: string, notes?: string) {
    const { error } = await supabase
      .from('requests')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        notes,
      })
      .eq('id', requestId);

    if (error) throw error;
  },

  async getReceiverRequests(receiverId: string) {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('receiver_id', receiverId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ReimbursementRequest[];
  },
};

// File Upload Service
export const storageService = {
  async uploadPhoto(file: File, path: string) {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('request-photos')
      .upload(`${path}/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from('request-photos')
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  },

  async deletePhoto(path: string) {
    const { error } = await supabase.storage
      .from('request-photos')
      .remove([path]);

    if (error) throw error;
  },
};

// Notification Service
export const notificationService = {
  async getNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Notification[];
  },

  async markAsRead(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    relatedId?: string
  ) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId,
        read: false,
      });

    if (error) throw error;
  },
};
