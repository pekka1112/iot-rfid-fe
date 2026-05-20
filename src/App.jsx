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
import DashboardPanels from './components/DashboardPanels';
import AIChat from './components/AIChat';
import CameraPage from './components/CameraPage';
import './App.css';

function AppContent() {
  const { isLoggedIn, hydrated } = useAuth();
  const [activeMenu, setActiveMenu] = useState('menu');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [fireAlert, setFireAlert] = useState(false);
  

  const [residents, setResidents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cards, setCards] = useState([]);

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/residents');
      if (response.data) {
        setResidents(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cư dân:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/access-logs');
      if (response.data) {
        const formattedLogs = response.data.map((log) => {
          const dateObj = new Date(log.createdAt);
          const timeFormatted = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const dateFormatted = dateObj.toLocaleDateString('vi-VN');
          return {
            id: log.logId,
            time: `${timeFormatted} ${dateFormatted}`,
            action: log.direction === 'IN' ? 'Xe vào' : 'Xe ra',
            detail: `${log.residentName || 'Khách'} - ${log.vehiclePlate || log.detectedPlate || 'Không rõ biển số'}`,
            vehiclePlate: log.vehiclePlate || log.detectedPlate,
            direction: log.direction,
            residentName: log.residentName
          };
        });
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Lỗi khi lấy nhật ký hệ thống:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/rfid-cards');
      if (response.data) {
        setCards(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thẻ RFID:', error);
    }
  };

  const totalResidents = residents.length;
  const guestLogs = logs.filter(log => !log.residentName || log.residentName === 'Khách');
  const totalGuests = cards.length + guestLogs.length;
  const totalIn = logs.filter(log => log.direction === 'IN' || log.action === 'Xe vào').length;
  const totalOut = logs.filter(log => log.direction === 'OUT' || log.direction === 'Ra' || log.action === 'Xe ra').length;

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
        // Log dữ liệu thô để debug vì backend có thể không trả `name`
        console.debug('fetchScannedData response:', response.data);

        const normalizeUser = (u) => {
          if (!u) return null;
          return {
            name: u.name || u.fullName || u.ownerName || u.cardUid || u.plateNumber || null,
            type: u.type || u.direction || '',
            room: u.room || '',
            status: u.status || '',
            detectedAt: u.detectedAt || u.createdAt || ''
          };
        };

        setCameras((prev) => prev.map((cam) => {
          if (cam.id === 1 && response.data.cameraIn) {
            return { ...cam, currentUser: normalizeUser(response.data.cameraIn) };
          }
          if (cam.id === 2 && response.data.cameraOut) {
            return { ...cam, currentUser: normalizeUser(response.data.cameraOut) };
          }
          return cam;
        }));
      }
    } catch (error) {
      console.error('Lỗi lấy dữ liệu RFID:', error);
    }
  };

  const fetchFireStatus = async () => {
    try {
      // Gọi API kiểm tra trạng thái cảm biến cháy từ Spring Boot
      const response = await axios.get('http://localhost:8080/api/sensor/fire');
      if (response.data && response.data.isFire) {
        setFireAlert(true);
      } else {
        setFireAlert(false);
      }
    } catch (error) {
      // Bỏ qua nếu backend chưa có API này, bạn có thể comment dòng setFireAlert(true) dưới đây để test UI
      // setFireAlert(true); // Uncomment để test giao diện cảnh báo cháy
    }
  };

  useEffect(() => {
    fetchScannedData();
    fetchFireStatus();
    fetchResidents();
    fetchLogs();
    fetchCards();

    // Tự động cập nhật mỗi 5 giây
    const interval = setInterval(() => {
      fetchScannedData();
      fetchFireStatus();
      fetchResidents();
      fetchLogs();
      fetchCards();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const setDoorByRelay = (id, relayValue) => {
    const isOpen = relayValue === 'OPEN';
    setCameras((prev) =>
      prev.map((camera) =>
        camera.id === id
          ? { ...camera, doorOpen: isOpen }
          : camera
      )
    );

    const cameraName = id === 1 ? 'Cửa Vào' : 'Cửa Ra';
    const actionName = isOpen ? 'mở' : 'đóng';
    const newNotif = {
      id: Date.now(),
      message: `${cameraName} đã được ${actionName}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      type: isOpen ? 'open' : 'close'
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setToasts((prev) => [...prev, newNotif]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newNotif.id));
    }, 3000);
  };

  // const handleDoorOpen = async (id) => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/relay/OPEN');
  //     console.log('API mở cửa response:', response.data);
  //     if (response.data?.status === 'success' && response.data.relay) {
  //       setDoorByRelay(id, response.data.relay);
  //     } else {
  //       console.error('API mở cửa trả về dữ liệu không hợp lệ:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi gọi API mở cửa:', error);
  //   }
  // };

  // const handleDoorClose = async (id) => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/relay/CLOSE');
  //     if (response.data?.status === 'success' && response.data.relay) {
  //       setDoorByRelay(id, response.data.relay);
  //     } else {
  //       console.error('API đóng cửa trả về dữ liệu không hợp lệ:', response.data);
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi gọi API đóng cửa:', error);
  //   }
  // };

const handleDoorOpen = async (id) => {
  try {
    const response = await axios.post('http://localhost:8000/relay/OPEN');
    console.log('Mở cửa response:', response.data); // xem log này trả gì
    setDoorByRelay(id, 'OPEN'); // cập nhật UI luôn, không cần check
  } catch (error) {
    console.error('Lỗi khi gọi API mở cửa:', error);
  }
};

const handleDoorClose = async (id) => {
  try {
    const response = await axios.post('http://localhost:8000/relay/CLOSE');
    console.log('Đóng cửa response:', response.data);
    setDoorByRelay(id, 'CLOSE');
  } catch (error) {
    console.error('Lỗi khi gọi API đóng cửa:', error);
  }
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
          fireAlert={fireAlert}
        />

        {activeMenu === 'menu' && (
          <div className="page-content">
            <div className="content-area">
              <div className="dashboard-stats" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div className="stat-card" style={{ flex: '1.5', minWidth: '260px', background: '#fff', padding: '5px 12px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Số người dùng</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{totalResidents}</div>
                </div>
                <div className="stat-card" style={{ flex: '1', minWidth: '140px', background: '#fff', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Tổng khách</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{totalGuests}</div>
                </div>
                <div className="stat-card" style={{ flex: '0.2', minWidth: '140px', background: '#fff', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đi vào</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{totalIn}</div>
                </div>
                <div className="stat-card" style={{ flex: '0.2', minWidth: '140px', background: '#fff', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đi ra</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>{totalOut}</div>
                </div>
                  
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

              <div className="dashboard-panels-container">
                <DashboardPanels logs={logs} cards={cards} />
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
            <CameraPage
              cameras={cameras}
              onOpen={handleDoorOpen}
              onClose={handleDoorClose}
            />
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
