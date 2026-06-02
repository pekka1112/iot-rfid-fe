import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppContent from './App';
import LoginPage from './components/LoginPage';
import ResidentsPage from './components/ResidentsPage';
import CameraPage from './components/CameraPage';
import HistoryPage from './components/HistoryPage';
import RfidCardsPage from './components/RfidCardsPage';
import SettingsPage from './components/SettingsPage';
import SearchPage from './components/SearchPage';
import ProfilePage from './components/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppContent />,
  },
  {
    path: '/residents',
    element: <AppContent />,
  },
  {
    path: '/camera',
    element: <AppContent />,
  },
  {
    path: '/history',
    element: <AppContent />,
  },
  {
    path: '/rfid',
    element: <AppContent />,
  },
  {
    path: '/settings',
    element: <AppContent />,
  },
  {
    path: '/search',
    element: <AppContent />,
  },
  {
    path: '/profile',
    element: <AppContent />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
