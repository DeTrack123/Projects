# 🗄️ MongoDB Migration Guide

## What Changed?

Your Project Tracker has been upgraded from JSON file storage to MongoDB database!

### ✅ Benefits of MongoDB

1. **Better Performance**: Faster queries, especially with many projects
2. **Data Validation**: Built-in schema validation ensures data quality
3. **Advanced Features**: Indexing, search, aggregation capabilities
4. **Scalability**: Can handle millions of projects
5. **Concurrent Access**: Multiple users can access simultaneously
6. **Data Integrity**: ACID transactions ensure data consistency

---

## 📦 New Dependencies

Added to `package.json`:
- **mongoose** (v8.8.4): MongoDB ODM (Object Data Modeling) library

---

## 🔄 File Changes

### Modified Files:

1. **Backend/.env**
   - Added: `MONGODB_URI` connection string

2. **Backend/express/config/database.js**
   - **Before**: Read/write JSON files
   - **After**: MongoDB connection management
   - New functions: `connectDB()`

3. **Backend/express/models/ProjectModel.js**
   - **Before**: Static methods with JSON operations
   - **After**: Mongoose schema with validation
   - Features:
     - Schema validation
     - Indexes for better performance
     - Custom methods (isOverdue, completeWorkflowStep)
     - Static query methods (searchProjects, getByStatus, getOverdue)

4. **Backend/express/controllers/projectController.js**
   - **Before**: `readProjects()` and `writeProjects()`
   - **After**: Mongoose model methods
   - Improvements:
     - Better error handling
     - Validation error messages
     - Query parameters for filtering/sorting
     - New endpoints: `getOverdueProjects`, `searchProjects`

5. **Backend/express/server.js**
   - Added: `connectDB()` call on startup
   - Added: Database status in health check

---

## 🆕 New Features

### 1. Advanced Querying

You can now filter and sort projects via URL parameters:

```javascript
// Get projects by status
GET /api/projects?status=in-progress

// Search projects
GET /api/projects?search=client name

// Sort by delivery date
GET /api/projects?sortBy=deliveryDate&order=desc

// Combine filters
GET /api/projects?status=pending&sortBy=createdAt&order=asc
```

### 2. Validation

The Mongoose schema automatically validates:
- **Required fields**: projectName, clientName, status, responsiblePerson, deliveryDate
- **String lengths**: Min/max character limits
- **Enums**: Status must be one of the predefined values
- **Dates**: Proper date format

### 3. Custom Methods

**Instance Methods** (on individual projects):
```javascript
project.isOverdue()  // Returns true if past delivery date
project.completeWorkflowStep('Design', 'John Doe')  // Mark step complete
```

**Static Methods** (on Project model):
```javascript
Project.searchProjects('search term')  // Search across multiple fields
Project.getByStatus('in-progress')     // Get all by status
Project.getOverdue()                   // Get all overdue projects
```

### 4. Automatic Timestamps

MongoDB automatically adds:
- `createdAt`: When project was created
- `updatedAt`: When project was last modified

### 5. Indexes

Performance-optimized indexes for:
- Text search (projectName, description, clientName)
- Status filtering
- Delivery date sorting

---

## 🔧 MongoDB Schema

### Project Document Structure:

```javascript
{
  _id: ObjectId("..."),              // MongoDB auto-generated ID
  projectName: String (required, 3-200 chars),
  projectDescription: String (max 1000 chars),
  clientName: String (required),
  status: String (enum: pending, in-progress, completed, on-hold, cancelled),
  responsiblePerson: String (required),
  deliveryDate: Date (required),
  startDate: Date (default: now),
  workflowStage: String (enum: default, equipment1, equipment2, equipment3),
  workflow: [
    {
      step: String (required),
      completed: Boolean (default: false),
      completedDate: Date,
      completedBy: String
    }
  ],
  notes: String (max 2000 chars),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## 📊 Database Collections

MongoDB organizes data into collections (similar to tables):

- **Collection Name**: `projects`
- **Database Name**: From your connection string (e.g., `project_tracker`)

---

## 🚀 Migration Process

### For New Installation:
1. No migration needed!
2. MongoDB will create the collection on first project creation
3. All projects will be stored in MongoDB

### For Existing Data (JSON → MongoDB):

If you had existing projects in `Backend/express/data/projects.json`, you can migrate them:

#### Option 1: Manual Migration (Simple)
1. Start the new MongoDB server
2. Open the old `projects.json` file
3. For each project, create it through the React UI or API

#### Option 2: Script Migration (Advanced)

Create `Backend/migrate.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Project = require('./express/models/ProjectModel');

const migrate = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read old JSON file
    const oldData = JSON.parse(
      fs.readFileSync('./express/data/projects.json', 'utf8')
    );

    // Insert all projects
    for (const project of oldData) {
      // Remove old ID, let MongoDB create new one
      delete project.id;
      
      // Create project in MongoDB
      await Project.create(project);
      console.log(`Migrated: ${project.projectName}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
```

Run migration:
```bash
cd Backend
node migrate.js
```

---

## 🔍 API Changes

### ID Format Changed

**Before**: Numeric ID (timestamp)
```json
{
  "id": 1737287654321
}
```

**After**: MongoDB ObjectId (24 hex characters)
```json
{
  "id": "507f1f77bcf86cd799439011"
}
```

### Error Responses Improved

**Validation Error Example**:
```json
{
  "error": "Validation failed",
  "details": [
    "Project name is required",
    "Delivery date is required"
  ]
}
```

**Invalid ID Format**:
```json
{
  "error": "Invalid project ID format"
}
```

---

## 🧪 Testing MongoDB Connection

### 1. Check MongoDB Connection

Look for this in server console:
```
✅ MongoDB Connected: cluster0-shard-00-00.mongodb.net
📊 Database: project_tracker
```

### 2. Test Health Endpoint

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "database": "MongoDB connected"
}
```

### 3. View Data in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Find `project_tracker` database
4. View `projects` collection

---

## 🐛 Troubleshooting

### Connection Issues

**Error**: `MongooseServerSelectionError`
- Check internet connection
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas

**Error**: `Authentication failed`
- Verify username/password in connection string
- Check database user permissions in Atlas

### Validation Errors

**Error**: `Validation failed`
- Check required fields are provided
- Verify data types match schema
- Check string length limits

### Data Not Saving

**Problem**: Projects not persisting
- Check MongoDB connection is established
- Look for error messages in console
- Verify collection permissions

---

## 🔐 Security Best Practices

1. **Never commit `.env` file** with connection string
2. **Use environment variables** for sensitive data
3. **Restrict IP access** in MongoDB Atlas
4. **Use strong passwords** for database users
5. **Enable 2FA** on MongoDB Atlas account
6. **Rotate credentials** regularly
7. **Use read-only users** where appropriate

---

## 📈 Performance Tips

1. **Use lean queries** when you don't need Mongoose documents:
   ```javascript
   Project.find().lean()  // Returns plain objects
   ```

2. **Select only needed fields**:
   ```javascript
   Project.find().select('projectName status')
   ```

3. **Use indexes** for frequently queried fields

4. **Limit results** for large datasets:
   ```javascript
   Project.find().limit(50)
   ```

5. **Use aggregation** for complex queries

---

## 🎓 Learning Resources

- **Mongoose Docs**: https://mongoosejs.com/docs/guide.html
- **MongoDB Manual**: https://docs.mongodb.com/manual/
- **MongoDB University**: https://university.mongodb.com/ (Free courses)
- **Schema Design**: https://docs.mongodb.com/manual/data-modeling/

---

## ✅ Verification Checklist

- [ ] MongoDB connection string in `.env`
- [ ] Mongoose installed (`npm install mongoose`)
- [ ] Server starts without errors
- [ ] Health check shows "MongoDB connected"
- [ ] Can create new projects
- [ ] Can view all projects
- [ ] Can update projects
- [ ] Can delete projects
- [ ] Projects persist after server restart
- [ ] Can view data in MongoDB Atlas

---

Congratulations! Your Project Tracker is now powered by MongoDB! 🎉
