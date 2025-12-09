# Deploy Backend Only to Railway

## 🚂 Backend-Only Deployment (Recommended)

### Method 1: Create New Service in Railway
1. **Go to Railway Dashboard**
2. **Click "New Service"**
3. **Select "GitHub Repo"**
4. **Choose your repository**
5. **IMPORTANT**: Set **Root Directory** to `backend`
6. **Railway will only deploy the backend folder**

### Method 2: Use Railway CLI (Advanced)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend only
cd backend
railway up
```

### Method 3: Create Separate Backend Repository
1. **Create new GitHub repository** called `zuno-backend`
2. **Copy only backend folder contents** to new repo
3. **Deploy the new repository** to Railway

## Environment Variables (Same for all methods)
```
PORT=5001
MONGO_URI=mongodb+srv://muskannsiingh:keHXrABEMzv8AkLA@cluster0.v96qtc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=matcha
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Why This Approach Works Better
- ✅ **No confusion** about which package.json to use
- ✅ **Faster deployments** (only backend code)
- ✅ **Cleaner separation** of frontend and backend
- ✅ **No caching issues** with wrong commands