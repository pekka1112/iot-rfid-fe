/**
 * Mock Data cho Testing - Không ảnh hưởng tới API thực
 */

// Scenario 1: Người xác thực được (Xác thực ✓)
export const mockVerifiedUser = {
  name: 'Nguyễn Văn A',
  vehiclePlate: '51A-123.45',
  isVerified: true,
  direction: 'IN',
  detectedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
  status: 'Đã xác thực',
  room: 'Căn hộ 502, Tòa A',
  failReason: null,
  dbPlates: null
};

// Scenario 2: Người lạ - Biển số không khớp
export const mockUnverifiedPlate = {
  name: 'Không xác định',
  vehiclePlate: '51A-999.99',
  isVerified: false,
  direction: 'IN',
  detectedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
  status: 'Người lạ',
  room: '',
  failReason: 'Biển số không khớp với khuôn mặt',
  dbPlates: ['51A-123.45', '51A-456.78', '51A-999.00']
};

// Scenario 3: Người lạ - Khuôn mặt không khớp
export const mockUnverifiedFace = {
  name: 'Không xác định',
  vehiclePlate: '51A-456.78',
  isVerified: false,
  direction: 'OUT',
  detectedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
  status: 'Người lạ',
  room: '',
  failReason: 'Khuôn mặt không khớp với biển số',
  dbPlates: ['51A-123.45', '51A-456.78', '51A-789.01']
};

// Scenario 4: Mock IntruderAlert
export const mockIntruderAlert = {
  camId: 1,
  directionText: 'Vào',
  detectedPlate: '51A-999.99',
  time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
  logId: 'LOG-' + Date.now()
};

// Helper để generate mock log mới
export const generateMockLog = (isVerified = true, direction = 'IN') => {
  const camId = direction === 'IN' ? 1 : 2;
  const directionText = direction === 'IN' ? 'Vào' : 'Ra';
  
  if (isVerified) {
    return {
      camera: camId,
      currentUser: {
        ...mockVerifiedUser,
        direction
      }
    };
  } else {
    return {
      camera: camId,
      alert: {
        ...mockIntruderAlert,
        camId,
        directionText
      }
    };
  }
};
