import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CameraCard from './components/CameraCard';
import WarningBox from './components/WarningBox';
import ResidentsPage from './components/ResidentsPage';
import HistoryPage from './components/HistoryPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import './App.css';

function AppContent() {
  const { isLoggedIn, hydrated } = useAuth();
  const [activeMenu, setActiveMenu] = useState('menu');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [stats] = useState({
    totalResidents: 150,
    totalGuests: 8,
    residentCount: 142,
  });

  const [cameras, setCameras] = useState([
    { id: 1, title: 'Camera Vào', isActive: true, doorOpen: false, currentUser: null },
    { id: 2, title: 'Camera Ra', isActive: true, doorOpen: false, currentUser: null },
  ]);

  const handleDoorOpen = (id) => {
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, doorOpen: true }
          : camera
      )
    );
  };

  const handleDoorClose = (id) => {
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, doorOpen: false }
          : camera
      )
    );
  };

  if (!hydrated) {
    return (
      <div className="auth-boot">
        <div className="auth-boot-inner" aria-busy="true" aria-label="Đang tải">
          <span className="auth-boot-dot" />
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />

      <main className="main-content">
        {activeMenu === 'menu' && (
          <>
            <Header
              totalResidents={stats.totalResidents}
              totalGuests={stats.totalGuests}
              residentCount={stats.residentCount}
              cameras={cameras}
              onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            />

            <div className="content-area">
              <div className="cameras-grid">
                {cameras.map((camera) => (
                  <CameraCard
                    key={camera.id}
                    title={camera.title}
                    isActive={camera.isActive}
                    doorOpen={camera.doorOpen}
                    currentUser={camera.currentUser}
                    onOpen={() => handleDoorOpen(camera.id)}
                    onClose={() => handleDoorClose(camera.id)}
                  />
                ))}
              </div>

              <div className="warning-container">
                <WarningBox message="Cảnh báo cháy" />
              </div>
            </div>
          </>
        )}

        {activeMenu === 'resident' && (
          <div className="page-content">
            <ResidentsPage />
          </div>
        )}

        {activeMenu === 'camera' && (
          <div className="page-content">
            <p>Camera page - Coming soon</p>
          </div>
        )}

        {activeMenu === 'history' && (
          <HistoryPage />
        )}

        {activeMenu === 'settings' && (
          <SettingsPage />
        )}

        {activeMenu === 'search' && (
          <SearchPage />
        )}

        {activeMenu === 'profile' && (
          <ProfilePage />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
