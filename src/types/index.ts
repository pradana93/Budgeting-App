/* Types for Budget Buddy Application */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'provider' | 'receiver';
  avatar_url?: string;
  partner_id?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  provider_id: string;
  amount: number;
  spent: number;
  remaining: number;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  limit?: number;
  budget_id: string;
  created_at: string;
}

export interface ReimbursementRequest {
  id: string;
  receiver_id: string;
  budget_id: string;
  category_id: string;
  amount: number;
  description: string;
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
}

export interface Transaction {
  id: string;
  budget_id: string;
  request_id?: string;
  amount: number;
  type: 'expense' | 'budget_reset';
  category?: string;
  description: string;
  created_at: string;
}

export interface PairingCode {
  id: string;
  code: string;
  created_by: string;
  paired_with?: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'request_submitted' | 'request_approved' | 'request_rejected' | 'budget_low' | 'budget_reset';
  title: string;
  message: string;
  related_id?: string;
  read: boolean;
  created_at: string;
}

export interface FormData {
  name?: string;
  role?: 'provider' | 'receiver';
  avatar?: string;
  email?: string;
  budgetAmount?: number;
  frequency?: 'weekly' | 'biweekly' | 'monthly';
  categories?: Category[];
  partnerEmail?: string;
  pairingCode?: string;
  description?: string;
  amount?: number;
  categoryId?: string;
  photo?: File;
}
