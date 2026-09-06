# 🚀 Deploying Budget Buddy to Vercel + Supabase

## Overview

This guide walks you through deploying Budget Buddy to **Vercel** (frontend) with **Supabase** (backend).

### Why This Stack?
- ✅ **Vercel**: Optimized for React/Next.js, automatic deployments, edge functions
- ✅ **Supabase**: Managed PostgreSQL, real-time, authentication, storage
- ✅ **Free Tier**: Both offer generous free tiers
- ✅ **Production Ready**: Enterprise-grade infrastructure
- ✅ **Seamless Integration**: Perfect for full-stack apps

---

## 📋 Pre-Deployment Checklist

- ✅ All code committed to GitHub
- ✅ `.env.local` configured locally (NOT in Git)
- ✅ Supabase project created
- ✅ Database schema deployed
- ✅ Storage bucket created
- ✅ GitHub account created
- ✅ Vercel account created

---

## 🔧 Step-by-Step Deployment

### Step 1: Prepare Your Project

#### 1a. Update `.gitignore`
Ensure sensitive files are ignored:

```bash
# .gitignore
node_modules/
dist/
.env.local
.env.*.local
```

#### 1b. Commit to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Budget Buddy application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/budgeting-app.git
git push -u origin main
```

#### 1c. Verify `.env.local` is NOT committed
```bash
git status
# Should NOT show .env.local
```

---

### Step 2: Setup Supabase Production Database

#### 2a. Create Production Supabase Project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Enter project name: "Budget Buddy Production"
4. Choose region closest to your users
5. Set strong database password
6. Click "Create new project"

#### 2b. Deploy Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy entire contents of `docs/database-schema.sql`
4. Paste into query editor
5. Click **"Run"** (execute all queries)

#### 2c. Create Storage Bucket
1. Go to **Storage** in left sidebar
2. Click **"New Bucket"**
3. Name: `request-photos`
4. Select **Private** (not public)
5. Click **"Create Bucket"**

#### 2d. Get Production Credentials
1. Go to **Project Settings** (gear icon)
2. Click **"API"**
3. Copy and save:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
4. Keep these secure - you'll need them for Vercel

---

### Step 3: Deploy to Vercel

#### 3a. Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click **"Import Project"**
4. Select **"GitHub"**
5. Authorize Vercel to access GitHub
6. Find and select your `budgeting-app` repository
7. Click **"Import"**

#### 3b. Configure Vercel Project
1. **Project Name**: `budget-buddy` (or your choice)
2. **Framework**: Select **"Vite"**
3. **Root Directory**: Leave blank (default)
4. **Build Command**: `npm run build` (should auto-detect)
5. **Output Directory**: `dist` (should auto-detect)
6. **Install Command**: `npm install` (auto-detected)

#### 3c. Add Environment Variables
In the environment variables section, add:

```
VITE_SUPABASE_URL = your_production_supabase_url
VITE_SUPABASE_ANON_KEY = your_production_anon_key
```

**Important**: 
- Use your **production** Supabase credentials (from Step 2d)
- NOT your local `.env.local` values
- Do NOT include the `.local` file

#### 3d. Deploy
1. Click **"Deploy"**
2. Wait for build to complete (usually 2-5 minutes)
3. See deployment URL (e.g., `budget-buddy.vercel.app`)

---

### Step 4: Verify Deployment

#### 4a. Test the Live App
1. Visit your Vercel deployment URL
2. Try **Sign Up**
3. Try **Setup Wizard**
4. Try **Submit a Request**
5. Verify data appears in Supabase

#### 4b. Check Logs
If issues occur:
1. In Vercel, go to **Deployments**
2. Click latest deployment
3. Click **"Logs"** tab
4. Check build errors

#### 4c. Test Supabase Connection
In Supabase dashboard:
1. Go to **Authentication** → **Users**
2. Verify new users appear when you sign up
3. Go to **profiles** table
4. Verify new profiles are created
5. Go to **Storage** → **request-photos**
6. Upload a photo and verify it works

---

### Step 5: Configure Custom Domain (Optional)

#### 5a. Add Domain to Vercel
1. In Vercel project, go to **Settings**
2. Click **"Domains"**
3. Enter your custom domain (e.g., budgetbuddy.com)
4. Follow DNS configuration instructions
5. Wait for DNS to propagate (usually 5-48 hours)

#### 5b. Enable HTTPS
- Vercel automatically enables HTTPS
- SSL certificate is auto-generated
- Should see 🔒 green lock in browser

---

## 🔄 Continuous Deployment

### Auto-Deploy on GitHub Push
Every time you push to GitHub main branch:

1. Vercel automatically:
   - Detects the change
   - Pulls latest code
   - Runs build: `npm run build`
   - Deploys to production
   - Runs tests (if configured)

2. You receive notifications on:
   - Build start
   - Build success/failure
   - Deployment complete

### Disable Auto-Deploy (Optional)
In Vercel Project Settings → Git:
- Toggle off "Automatic deployments"
- Then manually click "Redeploy"

---

## 📊 Monitoring & Maintenance

### Monitor Performance
In Vercel Dashboard:
1. **Analytics** tab shows:
   - Page load times
   - User locations
   - Request counts
   - Error rates

2. **Function Logs** show:
   - Server-side errors
   - API call logs
   - Performance metrics

### Monitor Database
In Supabase Dashboard:
1. **Database** section shows:
   - Storage usage
   - Connection count
   - Query performance
   - RLS policy violations

2. **Real-time** section shows:
   - Active subscriptions
   - Connection status

### Set Alerts
1. Vercel: Disable notifications for successful deploys
2. Supabase: Enable email alerts for errors
3. Both: Monitor free tier usage limits

---

## 💾 Backup & Recovery

### Database Backups
Supabase automatically backs up your database:
1. Go to **Project Settings** → **Backups**
2. Choose backup frequency (daily, weekly, etc.)
3. View backup history
4. Restore from backup if needed

### Code Backups
GitHub automatically backs up your code:
1. All commits are saved
2. Can restore any previous version
3. Keep important branches protected

---

## 🔐 Security in Production

### Environment Variables
✅ **DO**: Store in Vercel settings
❌ **DON'T**: Commit to Git

### Database Security
1. Supabase has RLS enabled by default
2. Your data is isolated per user/couple
3. Passwords are hashed
4. HTTPS is enforced

### Storage Security
1. Photos are stored in private bucket
2. Only authenticated users can upload
3. Users can only see their own photos
4. Automatic cleanup possible

### API Security
1. Vercel provides DDoS protection
2. Rate limiting available
3. OAuth ready for login
4. API keys are not exposed

---

## 📈 Scaling

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month, unlimited deployments
- **Supabase**: 500MB storage, 2GB bandwidth, 50,000 monthly active users

### When to Upgrade
- Supabase: When approaching storage/user limits
- Vercel: Rarely needed for most projects

### Upgrade Process
1. Supabase: Go to Billing → Upgrade Plan
2. Vercel: Go to Settings → Billing → Upgrade
3. Billing is prorated
4. No downtime during upgrade

---

## 🚨 Troubleshooting

### Issue: "Build Failed" in Vercel

**Solution**:
1. Check build logs in Vercel
2. Verify all dependencies in package.json
3. Run `npm install && npm run build` locally
4. Push fix to GitHub
5. Vercel will auto-redeploy

### Issue: "Environment Variables Not Found"

**Solution**:
1. In Vercel: Settings → Environment Variables
2. Verify both variables are added:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy after adding variables
4. Clear browser cache (Ctrl+Shift+Del)

### Issue: "Cannot Connect to Database"

**Solution**:
1. Verify Supabase is running (check status page)
2. Check credentials are correct
3. Verify RLS policies aren't blocking
4. Check network tab for error details
5. Verify Supabase storage bucket exists

### Issue: "Photos Not Uploading"

**Solution**:
1. Verify storage bucket exists and is private
2. Check storage policies in Supabase
3. Verify file size < 10MB
4. Check browser console for errors
5. Verify authenticated user exists

### Issue: "Slow Performance"

**Solution**:
1. Check Vercel analytics for slow pages
2. Check Supabase query performance
3. Enable React Query caching
4. Optimize images
5. Enable Vercel edge caching

---

## 🎯 Production Checklist

Before going live:

- ✅ Database backed up
- ✅ RLS policies verified
- ✅ Storage bucket created
- ✅ Environment variables set
- ✅ Custom domain configured
- ✅ HTTPS enabled
- ✅ Testing completed
- ✅ Users can signup/signin
- ✅ Requests work end-to-end
- ✅ Photos upload successfully
- ✅ Analytics working
- ✅ Dark mode works
- ✅ Mobile view works
- ✅ Error handling verified
- ✅ Performance acceptable

---

## 📝 Useful Commands

```bash
# Local testing before deployment
npm run build
npm run preview

# Check build size
npm run build -- --analyze

# Type check
npm run type-check

# Lint code
npm run lint

# View Vercel logs
vercel logs

# Redeploy from CLI
vercel --prod

# Check function logs
vercel --logs
```

---

## 📞 Support Resources

### Vercel Docs
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite on Vercel](https://vercel.com/docs/frameworks/vite)

### Supabase Docs
- [Supabase Production Checklist](https://supabase.com/docs/guides/hosting/overview)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

### Additional Resources
- [GitHub Documentation](https://docs.github.com)
- [Vite Deployment](https://vitejs.dev/guide/deployment.html)
- [React Best Practices](https://react.dev/learn)

---

## 🎉 You're Live!

Once deployed successfully, you'll have:

✅ **Production Frontend** on Vercel
✅ **Production Database** on Supabase
✅ **Auto-Deployments** on every Git push
✅ **Automatic Backups** of database
✅ **HTTPS Security** enabled
✅ **Custom Domain** support
✅ **Global CDN** distribution
✅ **Analytics** and monitoring

### Share with Your Partner!
1. Send them the deployment URL
2. They can sign up and start using it
3. Both can manage budgets together
4. Real-time updates across devices

---

## 🚀 Next Steps After Deployment

1. **Test thoroughly** - Try all features
2. **Share URL** - Send to your partner
3. **Monitor metrics** - Check performance
4. **Gather feedback** - Get user input
5. **Add features** - Based on feedback
6. **Keep secure** - Regular security reviews
7. **Scale when needed** - Upgrade plans

---

**Happy deploying! Your Budget Buddy is now live! 🎉**

For questions about Vercel or Supabase, check their documentation or reach out to their support teams.
