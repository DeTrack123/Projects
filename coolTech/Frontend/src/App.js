import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Credentials from './components/Credentials';
import DivisionCredentials from './components/DivisionCredentials';
import AddCredential from './components/AddCredential';
import EditCredential from './components/EditCredential';
import UserManagement from './components/UserManagement';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/credentials" 
            element={
              <PrivateRoute>
                <Credentials />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/credentials/division/:divisionId" 
            element={
              <PrivateRoute>
                <DivisionCredentials />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/credentials/add" 
            element={
              <PrivateRoute>
                <AddCredential />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/credentials/edit/:id" 
            element={
              <PrivateRoute>
                <EditCredential />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
