# 🚀 Quick Start Guide

## Start the Application in 3 Steps

### Step 1: Install Dependencies (First Time Only)
```bash
# In Backend folder
cd Backend
npm install
npm install cors nodemon

# In Frontend folder
cd ../Frontend/mcp_tracker
# Dependencies should already be installed
```

### Step 2: Start Backend Server
```bash
cd Backend
npm start
```
✅ Backend running on http://localhost:5000

### Step 3: Start Frontend (New Terminal)
```bash
cd Frontend/mcp_tracker
npm start
```
✅ Frontend will open on http://localhost:3000

---

## 🎯 Quick Reference

### File Locations

**Backend Main Files:**
- Server: `Backend/express/server.js`
- Config: `Backend/express/config/constants.js`
- Database: MongoDB Atlas (cloud)
- Models: `Backend/express/models/ProjectModel.js`

**Frontend Main Files:**
- App: `Frontend/mcp_tracker/src/App.js`
- Components: `Frontend/mcp_tracker/src/components/`
- Styles: `Frontend/mcp_tracker/src/App.css`

### Common Tasks

**Add Team Member:**
Edit `Backend/express/config/constants.js` → `teamMembers` array

**Add Status:**
Edit `Backend/express/config/constants.js` → `projectStatuses` object

**Add Workflow:**
Edit `Backend/express/config/constants.js` → `workflowStages` object

**Change Colors:**
Edit `Frontend/mcp_tracker/src/App.css`

### Troubleshooting

**Port Already in Use:**
```bash
# Kill process on port 5000 (Backend)
npx kill-port 5000

# Kill process on port 3000 (Frontend)
npx kill-port 3000
```

**Backend Not Connecting:**
1. Check Backend is running
2. Verify `.env` files exist
3. Check console for errors

**Frontend Build Errors:**
```bash
cd Frontend/mcp_tracker
rm -rf node_modules
npm install
npm start
```

---

## 📱 Features Overview

**Create Project:** Click "New Project" button
**Edit Project:** Click "Edit" on any project card
**Delete Project:** Click "Delete" and confirm
**Export Excel:** Click "Export to Excel"
**Email Client:** Click "Email" to copy formatted email

---

## 🔧 Configuration

**Backend Port:** Edit `Backend/.env` → `PORT=5000`
**API URL:** Edit `Frontend/mcp_tracker/.env` → `REACT_APP_API_URL=...`

---

## 📖 Full Documentation

- [CONVERSION_SUMMARY.md](CONVERSION_SUMMARY.md) - Complete conversion details
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [README.md](README.md) - Full documentation

---

## ✨ Enjoy Your New Project Tracker!
