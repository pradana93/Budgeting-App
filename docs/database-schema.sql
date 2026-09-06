-- Budget Buddy Database Schema for Supabase
-- Run these SQL queries in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('provider', 'receiver')),
  avatar_url TEXT,
  partner_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  spent DECIMAL(10,2) DEFAULT 0 CHECK (spent >= 0),
  remaining DECIMAL(10,2),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  limit DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  description TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_at TIMESTAMP WITH TIME ZONE
);

-- Transactions Table (for history)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'budget_reset')),
  category TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('request_submitted', 'request_approved', 'request_rejected', 'budget_low', 'budget_reset')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pairing Codes Table
CREATE TABLE IF NOT EXISTS pairing_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paired_with UUID REFERENCES profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_profiles_partner_id ON profiles(partner_id);
CREATE INDEX idx_budgets_provider_id ON budgets(provider_id);
CREATE INDEX idx_budgets_period_end ON budgets(period_end);
CREATE INDEX idx_categories_budget_id ON categories(budget_id);
CREATE INDEX idx_requests_receiver_id ON requests(receiver_id);
CREATE INDEX idx_requests_budget_id ON requests(budget_id);
CREATE INDEX idx_requests_status ON requests(status);
CREATE INDEX idx_requests_created_at ON requests(created_at);
CREATE INDEX idx_transactions_budget_id ON transactions(budget_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_pairing_codes_code ON pairing_codes(code);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairing_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own and partner's profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read partner profile" ON profiles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE partner_id = auth.uid() OR id = auth.uid()
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Budgets: Provider can manage, receiver can read
CREATE POLICY "Provider can manage own budgets" ON budgets
  FOR ALL USING (auth.uid() = provider_id);

CREATE POLICY "Receiver can read partner's budget" ON budgets
  FOR SELECT USING (
    auth.uid() IN (
      SELECT partner_id FROM profiles WHERE id = provider_id
    )
  );

-- Categories: Provider and receiver can read budget categories
CREATE POLICY "Users can read categories of their budget" ON categories
  FOR SELECT USING (
    budget_id IN (
      SELECT id FROM budgets WHERE 
        provider_id = auth.uid() OR
        provider_id IN (SELECT id FROM profiles WHERE partner_id = auth.uid())
    )
  );

-- Requests: Receiver creates, provider reviews
CREATE POLICY "Receiver can create requests" ON requests
  FOR INSERT WITH CHECK (
    receiver_id = auth.uid() AND
    budget_id IN (
      SELECT id FROM budgets WHERE 
        provider_id IN (SELECT partner_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Receiver can read own requests" ON requests
  FOR SELECT USING (receiver_id = auth.uid());

CREATE POLICY "Provider can read partner's requests" ON requests
  FOR SELECT USING (
    budget_id IN (SELECT id FROM budgets WHERE provider_id = auth.uid())
  );

CREATE POLICY "Provider can update requests in their budget" ON requests
  FOR UPDATE USING (
    budget_id IN (SELECT id FROM budgets WHERE provider_id = auth.uid())
  );

-- Notifications: Users can read own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create Storage Bucket for Photos
-- Run in Supabase Storage UI or via API
-- CREATE BUCKET request-photos;

-- Storage Bucket Policies
CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'request-photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can read photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'request-photos' AND 
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'request-photos' AND 
    auth.uid()::text = owner
  );
