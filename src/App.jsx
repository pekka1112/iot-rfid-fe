import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CameraCard from './components/CameraCard';
import IntruderAlert from './components/IntruderAlert';
import TestPanel from './components/TestPanel';
import WarningBox from './components/WarningBox';
import ResidentsPage from './components/ResidentsPage';
import HistoryPage from './components/HistoryPage';
import SearchPage from './components/SearchPage';
import SettingsPage from './components/SettingsPage';
import RfidCardsPage from './components/RfidCardsPage';
import LoginPage from './components/LoginPage';
import ProfilePage from './components/ProfilePage';
import DashboardPanels from './components/DashboardPanels';
import DashboardModal from './components/DashboardModal';
import AIChat from './components/AIChat';
import CameraPage from './components/CameraPage';
import './App.css';

function AppContent() {
  const { isLoggedIn, hydrated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [fireAlert, setFireAlert] = useState(false);
  const [intruderAlert, setIntruderAlert] = useState(null);
  const residentsRef = useRef([]);
  const lastLogIdRef = useRef({ IN: null, OUT: null });
  const notifIdRef = useRef(0);

  const [residents, setResidents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [cards, setCards] = useState([]);
  const [cameras, setCameras] = useState([
    { id: 1, title: 'Camera Vào', isActive: true, doorOpen: false, currentUser: null },
    { id: 2, title: 'Camera Ra', isActive: true, doorOpen: false, currentUser: null },
  ]);

  // Map routes to menu names for sidebar
  const getActiveMenuFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'menu';
    if (path.includes('residents')) return 'resident';
    if (path.includes('camera')) return 'camera';
    if (path.includes('history')) return 'history';
    if (path.includes('rfid')) return 'rfid';
    if (path.includes('settings')) return 'settings';
    if (path.includes('search')) return 'search';
    if (path.includes('profile')) return 'profile';
    return 'menu';
  };

  const handleMenuChange = (menu) => {
    const routes = {
      menu: '/',
      resident: '/residents',
      camera: '/camera',
      history: '/history',
      rfid: '/rfid',
      settings: '/settings',
      search: '/search',
      profile: '/profile',
    };
    navigate(routes[menu] || '/');
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/residents');
      if (response.data) {
        setResidents(response.data);
        // Giữ ref đồng bộ để dùng trong closure polling (tránh stale state)
        residentsRef.current = response.data;
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách cư dân:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/access-logs');
      if (response.data) {
        const rawLogs = response.data;

        const collapseWindowMs = 60 * 1000;

        const plateOf = (log) => (log?.vehiclePlate || log?.detectedPlate || '').trim();
        const platePresent = (log) => Boolean(plateOf(log));
        const isVerifiedStrict = (log) => {
          // Ưu tiên field tổng hợp từ backend, fallback theo 2 cờ match nếu backend trả.
          const okByAggregate = log?.isCorrectFaceAndPlate === true;
          const okByFlags = log?.faceMatch === true && log?.plateMatch === true;
          return platePresent(log) && (okByAggregate || okByFlags);
        };

        // Sort mới -> cũ để gộp trùng về bản ghi mới nhất
        const sorted = [...rawLogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Format + lọc chỉ hiển thị log hợp lệ (biển + khớp mặt/biển)
        const candidates = sorted
          .filter(isVerifiedStrict)
          .map((log) => {
            const dateObj = new Date(log.createdAt);
            const timeFormatted = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const dateFormatted = dateObj.toLocaleDateString('vi-VN');
            return {
              id: log.logId,
              createdAtMs: dateObj.getTime(),
              time: `${timeFormatted} ${dateFormatted}`,
              action: log.direction === 'IN' ? 'Xe vào' : 'Xe ra',
              detail: `${log.residentName || 'Khách'} - ${plateOf(log) || 'Không rõ biển số'}`,
              vehiclePlate: plateOf(log) || undefined,
              direction: log.direction,
              residentName: log.residentName,
              isCorrectFaceAndPlate: log.isCorrectFaceAndPlate,
              duplicateCount: 0,
              collapsedIds: [],
            };
          });

        // Gộp các bản ghi trùng trong 60s theo key
        const byKey = new Map();
        const collapsed = [];
        for (const row of candidates) {
          const key = [
            row.direction || '',
            row.vehiclePlate || '',
            row.residentName || '',
          ].join('|');

          const existingIdx = byKey.get(key);
          if (existingIdx === undefined) {
            byKey.set(key, collapsed.length);
            collapsed.push(row);
            continue;
          }

          const existing = collapsed[existingIdx];
          if (existing && (existing.createdAtMs - row.createdAtMs) <= collapseWindowMs) {
            existing.duplicateCount += 1;
            existing.collapsedIds.push(row.id);
          } else {
            // Ngoài cửa sổ 60s => coi là event mới
            byKey.set(key, collapsed.length);
            collapsed.push(row);
          }
        }

        setLogs(collapsed);

        // --- Phát hiện log mới nhất theo từng chiều và xử lý hiển thị ---
        ['IN', 'OUT'].forEach((dir) => {
          const camId = dir === 'IN' ? 1 : 2;
          const directionText = dir === 'IN' ? 'Vào' : 'Ra';

          // Lấy log mới nhất của chiều này
          const dirLogs = rawLogs
            .filter((l) => l.direction === dir)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          if (dirLogs.length === 0) return;
          const latestLog = dirLogs[0];
          const prevLogId = lastLogIdRef.current[dir];

          // Luôn cập nhật user khi lần đầu tải (prevLogId === null)
          const isNewLog = prevLogId !== null && prevLogId !== latestLog.logId;
          const isFirstLoad = prevLogId === null;

          if (!isFirstLoad && !isNewLog) return;

          // Cập nhật ref ngay
          lastLogIdRef.current[dir] = latestLog.logId;

          const dateObj = new Date(latestLog.createdAt);
          const timeStr = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const dateStr = dateObj.toLocaleDateString('vi-VN');
          console.log(latestLog)
          // Chỉ hiển thị user khi đạt đủ điều kiện: có biển + khớp mặt/biển
          if (isVerifiedStrict(latestLog)) {
            // Tìm cư dân trong danh sách
            const residentId = latestLog.residentId;
            const matched = residentsRef.current.find(
              (r) => r.id === residentId || r.residentId === residentId
            );

            setCameras((prev) =>
              prev.map((cam) => {
                if (cam.id !== camId) return cam;
                return {
                  ...cam,
                  currentUser: {
                    name: matched?.fullName || matched?.name || latestLog.residentName || 'Không rõ',
                    room: matched?.room || matched?.address || matched?.apartment || '',
                    vehiclePlate: plateOf(latestLog) || '',
                    status: 'Đã xác thực',
                    detectedAt: `${timeStr} ${dateStr}`,
                    direction: dir,
                    isVerified: true,
                  },
                };
              })
            );

            // Xoá cảnh báo cũ của camera này (nếu có)
            setIntruderAlert((prev) => (prev?.camId === camId ? null : prev));

          } else {
            // Không thỏa face + plate strict => không coi là xác thực
            setCameras((prev) =>
              prev.map((cam) => (cam.id === camId ? { ...cam, currentUser: null } : cam))
            );

            // Chỉ hiện popup khi là log MỚI (không phải lần đầu load)
            if (isNewLog) {
              setIntruderAlert({
                camId,
                directionText,
                detectedPlate: latestLog.detectedPlate || latestLog.vehiclePlate || 'Không rõ',
                time: `${timeStr} ${dateStr}`,
                logId: latestLog.logId,
              });
            }
          }
        });
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
    } catch {
      // Bỏ qua nếu backend chưa có API này, bạn có thể comment dòng setFireAlert(true) dưới đây để test UI
      // setFireAlert(true); // Uncomment để test giao diện cảnh báo cháy
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchScannedData();
      await fetchFireStatus();
      await fetchResidents();
      await fetchLogs();
      await fetchCards();
    };
    init();

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
      id: (notifIdRef.current += 1),
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
  // Chỉ mở cửa (qua đó backend mới ghi log) khi đã xác thực đủ mặt + biển số
  const cam = cameras.find((c) => c.id === id);
  const canOpen = cam?.currentUser?.isVerified === true;
  if (!canOpen) {
    console.warn('Blocked opening door: face + plate not verified', { id });
    return;
  }

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

// ===== TEST MODE HANDLERS =====
const handleTestData = (scenarioId, testData) => {
  console.log('🧪 Test Scenario:', scenarioId, testData);
  
  if (testData.camera && testData.currentUser) {
    // Hiển thị người dùng xác thực
    setCameras((prev) =>
      prev.map((cam) =>
        cam.id === testData.camera
          ? { ...cam, currentUser: testData.currentUser }
          : cam
      )
    );
    // Clear alert nếu có
    setIntruderAlert(null);
  } else if (testData.camera && testData.alert) {
    // Hiển thị cảnh báo người lạ
    setCameras((prev) =>
      prev.map((cam) =>
        cam.id === testData.camera
          ? { ...cam, currentUser: null }
          : cam
      )
    );
    setIntruderAlert(testData.alert);
  }
};

const handleClearTestData = () => {
  console.log('🧪 Clear Test Data');
  setCameras((prev) =>
    prev.map((cam) => ({ ...cam, currentUser: null }))
  );
  setIntruderAlert(null);
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

  const activeMenu = getActiveMenuFromPath();

  return (
    <div className="app-container">
      <Sidebar
        activeMenu={activeMenu}
        onMenuChange={handleMenuChange}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
      />

      <main className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header 
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          onMenuChange={handleMenuChange}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          fireAlert={fireAlert}
          onToggleDashboard={() => setIsDashboardVisible(!isDashboardVisible)}
          isDashboardVisible={isDashboardVisible}
        />

        {activeMenu === 'menu' && (
          <div className="page-content">
            <div className={`content-area ${!isDashboardVisible ? 'dashboard-hidden' : ''}`}>

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

              {isDashboardVisible && (
                <DashboardModal
                  isOpen={isDashboardVisible}
                  onClose={() => setIsDashboardVisible(false)}
                  logs={logs}
                  cards={cards}
                  cameras={cameras}
                  totalResidents={totalResidents}
                  totalGuests={totalGuests}
                  totalIn={totalIn}
                  totalOut={totalOut}
                  isOnHomePage={true}
                />
              )}
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

        {/* Dashboard Modal for other pages */}
        {activeMenu !== 'menu' && (
          <DashboardModal
            isOpen={isDashboardVisible}
            onClose={() => setIsDashboardVisible(false)}
            logs={logs}
            cards={cards}
            cameras={cameras}
            totalResidents={totalResidents}
            totalGuests={totalGuests}
            totalIn={totalIn}
            totalOut={totalOut}
            isOnHomePage={false}
          />
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

      {/* Test Panel - Để test mà không ảnh hưởng API thực */}
      <TestPanel 
        onTestData={handleTestData}
        onClearData={handleClearTestData}
      />

      {/* Intruder Alert Component */}
      <IntruderAlert 
        alert={intruderAlert} 
        onClose={() => setIntruderAlert(null)} 
      />
    </div>
  );
}

export default AppContent;
