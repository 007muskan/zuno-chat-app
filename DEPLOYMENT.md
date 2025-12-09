# Zuno Chat App Deployment Guide

## Architecture
- **Frontend**: Vercel (instant loading, free)
- **Backend**: Railway (always-on Socket.io support, $5/month)
- **Database**: MongoDB Atlas (existing, free)

## Features Supported
✅ **Real-time messaging** (Socket.io)
✅ **Video calling** (WebRTC signaling)
✅ **Typing indicators**
✅ **User authentication** (JWT)
✅ **Group chats**
✅ **File uploads**

## Deployment Steps

### 1. Deploy Backend to Railway

1. **Sign up at [railway.app](https://railway.app)**
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your repository** and choose the `backend` folder as root
4. **Railway auto-detects Node.js** and starts building
5. **Add Environment Variables** in Railway dashboard:
   ```
   PORT=5001
   MONGO_URI=mongodb+srv://muskannsiingh:keHXrABEMzv8AkLA@cluster0.v96qtc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=matcha
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. **Copy your Railway URL** (e.g., `https://zuno-backend-production.railway.app`)

### 2. Deploy Frontend to Vercel

1. **Sign up at [vercel.com](https://vercel.com)**
2. **New Project** → Import your GitHub repository
3. **Configure Project**:
   - Root Directory: `frontend`
   - Framework Preset: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```
5. **Deploy!**

### 3. Update Cross-Origin Configuration

1. **Update `backend/.env`** with your Vercel URL:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
2. **Push to GitHub** → Railway auto-redeploys

### 4. Update Frontend API URL

1. **Update `frontend/.env`**:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```
2. **Push to GitHub** → Vercel auto-redeploys

## Testing Your Deployment

1. **Visit your Vercel URL** → Should load instantly
2. **Register/Login** → Test authentication
3. **Send messages** → Test real-time messaging
4. **Try video call** → Test WebRTC functionality
5. **Test typing indicators** → Should work in real-time

## Benefits of This Setup

✅ **No Cold Starts**: Frontend loads instantly, backend always running
✅ **Full Socket.io Support**: Real-time features work perfectly
✅ **WebRTC Support**: Video calling works seamlessly
✅ **Auto Deployments**: Push to GitHub = automatic deployment
✅ **Global CDN**: Fast loading worldwide
✅ **Scalable**: Handles traffic spikes automatically

## Costs Breakdown
- **Vercel**: Free (100GB bandwidth, unlimited static sites)
- **Railway**: $5/month (hobby plan, always-on)
- **MongoDB Atlas**: Free (512MB storage)

**Total**: $5/month for professional-grade hosting

## Troubleshooting

**Socket.io Connection Issues:**
- Check CORS configuration in backend
- Verify VITE_API_URL in frontend environment
- Ensure Railway backend is running

**Video Call Not Working:**
- Check WebRTC signaling in browser console
- Verify Socket.io connection is established
- Test with HTTPS (required for WebRTC)

**Authentication Issues:**
- Verify JWT_SECRET is set in Railway
- Check MongoDB connection
- Ensure user registration works first