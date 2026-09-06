# ⚡ Vercel + Supabase Deployment Quick Reference

## 🚀 Deploy in 5 Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 2. Create Supabase Production Project
- Go to supabase.com
- Create new project
- Run `docs/database-schema.sql`
- Create `request-photos` bucket
- Copy credentials

### 3. Setup Vercel Project
- Go to vercel.com
- Click "Import Project"
- Select your GitHub repo
- Framework: Vite
- Build: `npm run build`

### 4. Add Environment Variables
```
VITE_SUPABASE_URL = your_production_url
VITE_SUPABASE_ANON_KEY = your_production_key
```

### 5. Deploy
- Click "Deploy"
- Wait 2-5 minutes
- Visit your live URL! ✅

---

## 📊 Production URLs

| Service | URL Format |
|---------|-----------|
| **Vercel Frontend** | `your-project.vercel.app` |
| **Supabase Dashboard** | `app.supabase.com` |
| **Custom Domain** | `yourdomain.com` |

---

## 🔑 Production Credentials

**Keep these secret!**

```
VITE_SUPABASE_URL = [from Supabase Project Settings → API]
VITE_SUPABASE_ANON_KEY = [from Supabase Project Settings → API]
```

---

## ✅ Verification Checklist

- [ ] GitHub repo public/private
- [ ] `.env.local` in .gitignore
- [ ] Supabase database deployed
- [ ] Storage bucket created
- [ ] Vercel environment variables set
- [ ] Build succeeds locally: `npm run build`
- [ ] Can signup at production URL
- [ ] Can submit requests
- [ ] Can upload photos
- [ ] Data appears in Supabase

---

## 🔄 Auto-Deployment

**How It Works:**
1. Push code to GitHub `main` branch
2. Vercel detects change
3. Vercel builds project
4. Vercel deploys automatically
5. You get URL ✅

**No manual deployment needed!**

---

## 📈 Monitoring

### Vercel Dashboard
- Analytics tab → Performance metrics
- Deployments tab → Deployment history
- Logs → Build/runtime errors

### Supabase Dashboard
- Database tab → Data/performance
- Auth tab → User count
- Storage tab → File storage usage

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs, run `npm run build` locally |
| Env vars missing | Add to Vercel Settings → Environment Variables |
| DB not found | Verify Supabase URL and key are correct |
| Photos not uploading | Check storage bucket exists and is private |
| Slow performance | Check analytics, optimize images |

---

## 📚 Useful Links

- **Vercel Docs**: vercel.com/docs
- **Supabase Docs**: supabase.com/docs
- **GitHub Docs**: docs.github.com
- **Vite Docs**: vitejs.dev

---

## 🔒 Security Checklist

- ✅ HTTPS enabled (automatic on Vercel)
- ✅ RLS policies active in Supabase
- ✅ Environment variables in Vercel (not Git)
- ✅ Storage bucket is private
- ✅ Database backups enabled
- ✅ No API keys in code

---

## 💡 Pro Tips

1. **Preview Deployments** - Vercel creates PR previews
2. **Rollback** - Can deploy any previous version
3. **Custom Domain** - Add in Vercel Settings → Domains
4. **Analytics** - Monitor in Vercel dashboard
5. **Auto-scale** - No config needed, automatic
6. **Backup** - Supabase auto-backups daily

---

## 🎯 After Deployment

✅ Share URL with your partner
✅ Test all features in production
✅ Monitor performance metrics
✅ Gather user feedback
✅ Deploy improvements
✅ Keep secure and updated

---

**Budget Buddy is live! 🚀**
