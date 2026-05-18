import { useState, useEffect } from 'react';
import axios from 'axios';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CameraCard from './components/CameraCard';
import WarningBox from './components/WarningBox';
import ResidentsPage from './components/ResidentsPage';
import HistoryPage from './components/HistoryPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import RfidCardsPage from './components/RfidCardsPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import AIChat from './components/AIChat';
import './App.css';

function AppContent() {
  const { isLoggedIn, hydrated } = useAuth();
  const [activeMenu, setActiveMenu] = useState('menu');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const [stats] = useState({
    totalResidents: 150,
    totalGuests: 8,
    residentCount: 142,
  });

  const [cameras, setCameras] = useState([
    { id: 1, title: 'Camera Vào', isActive: true, doorOpen: false, currentUser: null },
    { id: 2, title: 'Camera Ra', isActive: true, doorOpen: false, currentUser: null },
  ]);

  const fetchScannedData = async () => {
    try {
      // Gọi API lấy dữ liệu người dùng quét thẻ hiện tại
      // Chú ý: bạn có thể thay đổi đường dẫn '/api/rfid/scanned' theo API thực tế
      const response = await axios.get('http://localhost:8080/api/rfid/scanned');
      if (response.data) {
        setCameras((prev) => prev.map((cam) => {
          // Giả sử API trả về { cameraIn: { name, type, room, status, detectedAt }, cameraOut: {...} }
          if (cam.id === 1 && response.data.cameraIn) {
            return { ...cam, currentUser: response.data.cameraIn };
          }
          if (cam.id === 2 && response.data.cameraOut) {
            return { ...cam, currentUser: response.data.cameraOut };
          }
          return cam;
        }));
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu RFID:', error);
    }
  };

  useEffect(() => {
    // Tự động cập nhật mỗi 5 giây
    const interval = setInterval(() => {
      fetchScannedData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDoorOpen = async (id) => {
    try {
      // Gọi API xuống Spring Boot để mở relay
      await axios.post('http://localhost:8080/api/relay/open', { cameraId: id });
    } catch (error) {
      console.error('Lỗi khi gọi API mở cửa:', error);
    }

    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, doorOpen: true }
          : camera
      )
    );
    const cameraName = id === 1 ? 'Cửa Vào' : 'Cửa Ra';
    const newNotif = {
      id: Date.now(),
      message: `${cameraName} đã được mở`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'open'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToasts((prev) => [...prev, newNotif]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newNotif.id));
    }, 3000);
  };

  const handleDoorClose = async (id) => {
    try {
      // Gọi API xuống Spring Boot để đóng relay
      await axios.post('http://localhost:8080/api/relay/close', { cameraId: id });
    } catch (error) {
      console.error('Lỗi khi gọi API đóng cửa:', error);
    }

    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, doorOpen: false }
          : camera
      )
    );
    const cameraName = id === 1 ? 'Cửa Vào' : 'Cửa Ra';
    const newNotif = {
      id: Date.now(),
      message: `${cameraName} đã được đóng`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: 'close'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToasts((prev) => [...prev, newNotif]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newNotif.id));
    }, 3000);
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
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          onMenuChange={setActiveMenu}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />

        {activeMenu === 'menu' && (
          <div className="page-content">
            <div className="content-area">
              <div className="dashboard-stats" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="stat-card" style={{ flex: '1.5', minWidth: '260px', background: '#fff', padding: '16px 24px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '16px', color: '#64748b', fontWeight: '600' }}></div>
                  <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} title={cameras[0].doorOpen ? 'Vào: Mở' : 'Vào: Đóng'}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>C.Vào: </span>
                      {cameras[0].doorOpen ? (
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M10 12v.01" /><path d="M14 4h4a2 2 0 0 1 2 2v14" />
                        </svg>
                      ) : (
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M14 12v.01" />
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} title={cameras[1].doorOpen ? 'Ra: Mở' : 'Ra: Đóng'}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#334155' }}>C.Ra: </span>
                      {cameras[1].doorOpen ? (
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M10 12v.01" /><path d="M14 4h4a2 2 0 0 1 2 2v14" />
                        </svg>
                      ) : (
                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M14 12v.01" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '12px 18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Số người dùng</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{stats.totalResidents}</div>
                </div>
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '12px 18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Tổng khách</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{stats.totalGuests}</div>
                </div>
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '12px 18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Số người vào</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{stats.totalGuests}</div>
                </div>
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '12px 18px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Số người ra</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{stats.residentCount}</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Nhận diện khu vực cửa</h2>
                <button 
                  onClick={fetchScannedData}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v6h6"/>
                  </svg>
                  Làm mới dữ liệu RFID
                </button>
              </div>

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
          </div>
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

        {activeMenu === 'rfid' && (
          <div className="page-content">
            <RfidCardsPage />
          </div>
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

      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'open' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 20V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M10 12v.01" /><path d="M14 4h4a2 2 0 0 1 2 2v14" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 20V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" /><path d="M2 20h20" /><path d="M14 12v.01" />
                </svg>
              )}
            </div>
            <div className="toast-content">
              <p className="toast-message">{toast.message}</p>
              <p className="toast-time">{toast.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
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
