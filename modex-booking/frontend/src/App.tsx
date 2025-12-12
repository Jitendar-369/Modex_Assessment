import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Common/Navbar';
import LandingPage from './components/Common/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import UserDashboard from './components/User/UserDashboard';
import MyBookings from './components/User/MyBookings';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateShow from './components/Admin/CreateShow';
import ShowList from './components/Admin/ShowList';
import BookingList from './components/Admin/BookingList';

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={
          user ? (
            <Navigate to={user.role === 'admin' ? "/admin" : "/shows"} />
          ) : (
            <LandingPage />
          )
        } />

        <Route path="/shows" element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/create-show" element={
          <AdminRoute>
            <CreateShow />
          </AdminRoute>
        } />
        <Route path="/admin/shows" element={
          <AdminRoute>
            <ShowList />
          </AdminRoute>
        } />
        <Route path="/admin/bookings" element={
          <AdminRoute>
            <BookingList />
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BookingProvider>
          <Router>
            <AppRoutes />
          </Router>
        </BookingProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
