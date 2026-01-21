# Project Tracker - React & Express Setup Guide

This document provides instructions for running the newly created React and Express version of the Project Tracker.

## 🚀 Quick Start

### Backend (Express API)

1. **Navigate to Backend directory**:
   ```bash
   cd Backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   npm install cors nodemon
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on: `http://localhost:5000`

### Frontend (React App)

1. **Navigate to Frontend directory**:
   ```bash
   cd Frontend/mcp_tracker
   ```

2. **Start the React app**:
   ```bash
   npm start
   ```

   The React app will run on: `http://localhost:3000`

## 📂 New File Structure

### Backend Files Created
```
Backend/
├── express/
│   ├── server.js                    # Main Express server
│   ├── config/
│   │   ├── database.js              # JSON file operations
│   │   └── constants.js             # Statuses, team members, workflows
│   ├── controllers/
│   │   └── projectController.js     # API request handlers
│   ├── models/
│   │   └── ProjectModel.js          # Data model operations
│   └── routes/
│       └── projectRoutes.js         # API route definitions
├── data/
│   └── projects.json                # Data storage
├── .env                             # Environment variables
└── package.json                     # Updated with scripts
```

### Frontend Files Created
```
Frontend/mcp_tracker/
├── src/
│   ├── components/
│   │   ├── Header.js                # Application header
│   │   ├── ProjectList.js           # List of projects
│   │   ├── ProjectCard.js           # Individual project display
│   │   ├── ProjectForm.js           # Create new project
│   │   ├── EditModal.js             # Edit existing project
│   │   └── WorkflowUI.js            # Workflow steps management
│   ├── services/
│   │   └── projectService.js        # API communication
│   ├── utils/
│   │   └── emailGenerator.js        # Email template generation
│   ├── App.js                       # Main application (updated)
│   └── App.css                      # Application styles (updated)
├── public/
│   ├── index.html                   # HTML template (updated)
│   └── megchem_logo2.jpg            # Company logo (add manually)
└── .env                             # Environment variables
```

## 🔧 Configuration

### Environment Variables

**Backend** (`Backend/.env`):
```
PORT=5000
NODE_ENV=development
```

**Frontend** (`Frontend/mcp_tracker/.env`):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Customization

Edit `Backend/express/config/constants.js` to modify:
- Team members
- Project statuses
- Workflow stages
- Stage labels

## 🌐 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Configuration
- `GET /api/projects/config/all` - Get all config data

### Health Check
- `GET /api/health` - Server status

## ✨ Features

### ✅ Implemented
- Create, read, update, delete projects
- Project status tracking with color indicators
- Team member assignment
- Workflow stage management
- Due date tracking with overdue indicators
- Excel export functionality
- Email generation for client updates
- Responsive design
- Real-time validation

### 🎨 UI Features
- Fixed bottom-left logo
- Modal editing
- Color-coded statuses
- Overdue date highlighting
- Workflow step tracking
- Activity timeline

## 📝 Notes

1. **Logo**: Place `megchem_logo2.jpg` in `Frontend/mcp_tracker/public/` directory
2. **Data Storage**: Projects are stored in MongoDB Atlas cloud database
3. **Excel Export**: Uses SheetJS library loaded from CDN
4. **CORS**: Enabled for cross-origin requests between React and Express

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `.env` file has correct API URL
- Ensure CORS is enabled in Express server

### Excel export not working
- Verify SheetJS library is loaded in `index.html`
- Check browser console for errors

## 🔄 Migration from Old Code

The application has been completely rewritten:
- **Vanilla JS → React**: All UI logic is now in React components
- **localStorage → Express API**: Data now persists on the server
- **Single HTML file → Component-based**: Better code organization and reusability
- **Inline scripts → Modular services**: Separated concerns for better maintainability

## 📞 Support

For issues or questions, refer to the main README.md or contact the development team.
