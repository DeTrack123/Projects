# Cool Tech Credential Management System

A full-stack credential management application with role-based access control and JWT authentication.

## Setup

1. **Install Dependencies**
```bash
cd Backend
npm install

cd ../Frontend
npm install
```

2. **Environment Variables**

Create a `.env` file in the Backend folder:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4500
```

3. **Run the Application**

Backend (from Backend folder):
```bash
npm start
```

Frontend (from Frontend folder):
```bash
npm start
```

Backend runs on `http://localhost:4500`  
Frontend runs on `http://localhost:3000`

## User Roles & Permissions

- **Normal**: View and Add credentials
- **Management**: View, Add, and Update credentials
- **Admin**: Full access + User management

## Project Structure

```
Backend/
  ├── controllers/      # Route handlers
  ├── models/          # Database schemas
  ├── routes/          # API routes
  ├── middleware/      # JWT verification
  └── index.js         # Server entry point

Frontend/
  ├── src/
  │   ├── components/  # React components
  │   └── services/    # API calls
  └── public/
```
