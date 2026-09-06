# Supabase Setup Guide for Budget Buddy

This guide walks you through setting up your Supabase project for Budget Buddy.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: Budget Buddy (or your choice)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest to your location

## 2. Set Up the Database

1. Once your project is created, go to the SQL Editor
2. Click "New Query"
3. Copy and paste the entire contents of `database-schema.sql`
4. Click "Run" to execute all queries

This will create:
- All necessary tables (profiles, budgets, categories, requests, etc.)
- Indexes for performance
- Row Level Security policies
- Storage bucket for photos

## 3. Create Storage Bucket

1. Go to **Storage** in the sidebar
2. Click "New Bucket"
3. Name it: `request-photos`
4. Make it **Private** (not public)
5. Click "Create Bucket"

## 4. Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy your:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Key** → `VITE_SUPABASE_ANON_KEY`
3. Create `.env.local` in the project root:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 5. Set Up Authentication

1. Go to **Authentication** → **Providers**
2. Ensure "Email" is enabled (it should be by default)
3. Optional: Enable Google/GitHub providers

## 6. Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - Confirmation email
   - Password reset email
   - etc.

## 7. Set Storage Policies

1. Go to **Storage** → **request-photos**
2. Click the three dots → **Policies**
3. The policies from the schema should already be applied

## 8. Enable Realtime (Optional)

For real-time updates:

1. Go to **Project Settings** → **Replication**
2. Enable replication for these tables:
   - `requests`
   - `notifications`
   - `budgets`

## 9. Test the Setup

1. Run the development server: `npm run dev`
2. Try signing up with an email
3. Check the **Auth** section in Supabase to see your user
4. Check the **SQL Editor** → **profiles** table to verify the profile was created

## Troubleshooting

### "Column does not exist" errors
- Make sure you ran all SQL queries from `database-schema.sql`
- Check that all tables are created: Go to **SQL Editor** and run:
  ```sql
  SELECT * FROM information_schema.tables WHERE table_schema = 'public';
  ```

### RLS Policy errors
- Ensure you're logged in (RLS policies require authentication)
- Check the **Authentication** section to see if your user is created
- View RLS policy details in the table editor

### Photo upload not working
- Make sure the `request-photos` bucket is created
- Check storage policies are applied
- Verify the bucket is **Private** not Public

### Realtime not working
- Enable realtime on the tables in **Project Settings** → **Replication**
- Make sure you're using `.on()` subscription properly in code

## Next Steps

1. Configure your `.env.local` file with Supabase credentials
2. Run `npm install` to install dependencies
3. Start development server: `npm run dev`
4. Test the signup and setup wizard flow

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
