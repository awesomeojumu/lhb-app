import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // make sure this exists
import ProtectedRoute from './router/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import Register from './pages/Register'; // Import the Register component

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected route for the dashboard */}
          {/* Ensure that the ProtectedRoute component is correctly implemented */}
          {/* It should redirect unauthenticated users to the login page */}
          {/* If the user is authenticated, it should render the Dashboard component */}
          {/* Adjust the path as necessary based on your routing structure */}
          {/* This assumes that the ProtectedRoute component handles authentication logic */}
          {/* If you have other protected routes, you can add them here as well */}
          {/* Example of a protected route for the dashboard */}
          {/* You can add more routes as needed */}
          {/* Ensure that the Dashboard component is correctly implemented */}
          {/* It should display the user's dashboard or relevant information */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
