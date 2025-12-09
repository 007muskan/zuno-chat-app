# Railway Deployment Instructions

## 🚂 Deploy Backend to Railway

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with your GitHub account

### 2. Deploy Project - IMPORTANT STEPS
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **zuno repository**
4. **CRITICAL**: In the deployment settings:
   - Set **Root Directory** to `backend`
   - Or create a new service and select only the backend folder
5. Railway will auto-detect Node.js and start building

### 3. Add Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```
PORT=5001
MONGO_URI=mongodb+srv://muskannsiingh:keHXrABEMzv8AkLA@cluster0.v96qtc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=matcha
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 4. Get Your Railway URL
- After deployment, Railway will give you a URL like:
- `https://zuno-backend-production.railway.app`
- **Copy this URL** - you'll need it for Vercel

### 5. Test Your Backend
Visit your Railway URL - you should see: "API is running successfully"

---

## 🚀 Deploy Frontend to Vercel

### 1. Update Frontend Environment
Update `frontend/.env` with your Railway URL:
```
VITE_API_URL=https://your-railway-backend.railway.app
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"New Project"**
4. Import your repository
5. Set **Root Directory** to `frontend`
6. Add environment variable: `VITE_API_URL=https://your-railway-backend.railway.app`
7. Deploy!

### 3. Update Backend CORS
Update Railway environment variable:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## ✅ Testing Your Deployment

1. **Visit Vercel URL** → Should load instantly
2. **Register a new user** → Test authentication
3. **Send messages** → Test real-time chat
4. **Try video call** → Test WebRTC

---

## 🔧 Troubleshooting

**Backend not starting?**
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure MongoDB URI is correct

**Frontend can't connect?**
- Check VITE_API_URL in Vercel environment
- Verify CORS settings in Railway
- Check browser console for errors

**Socket.io not working?**
- Ensure Railway backend is running
- Check WebSocket connections in browser dev tools
- Verify CORS allows your Vercel domain