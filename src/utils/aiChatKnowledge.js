export const FAQ_ENTRIES = [
  {
    keywords: ['he thong nay la gi', 'he thong la gi', 'smartpark', 'vpark', 'aiot', 'gui xe thong minh'],
    answer:
      'SmartPark - AIOT (VPark) là hệ thống gửi xe thông minh, tích hợp RFID, camera nhận diện khuôn mặt và biển số, cảnh báo cháy và quản lý người dùng. Bạn có thể theo dõi xe vào/ra, quản lý thẻ RFID và xem lịch sử truy cập trên dashboard.',
  },
  {
    keywords: ['cai dat', 'settings', 'cau hinh', 'cai dat o dau', 'cai dat tai khoan'],
    answer:
      'Vào menu **Cài đặt** trên Sidebar (biểu tượng bánh răng), hoặc bấm avatar góc phải → **Cài đặt tài khoản**. Tại đây bạn cấu hình RFID, sao lưu người dùng thiết bị và các tùy chọn hệ thống.',
  },
  {
    keywords: ['rfid', 'the rfid', 'quet the', 'quẹt thẻ', 'rfid hoat dong', 'rfid hoạt động'],
    answer:
      'Thẻ RFID quản lý tại menu **Thẻ RFID**. Khi quẹt vào, hệ thống ghi nhận xe vào; quẹt ra (cùng UID và đúng biển số) thì xe ra. Bạn sẽ thấy toast "Quẹt thẻ thành công - Vào/Ra".',
  },
  {
    keywords: ['camera', 'nhan dien', 'khuon mat', 'bien so', 'nhận diện'],
    answer:
      'Menu **Camera** hiển thị luồng cổng vào/ra. Hệ thống đối chiếu khuôn mặt và biển số; nếu không khớp có thể cảnh báo người lạ tùy cấu hình hiện tại.',
  },
  {
    keywords: ['lich su', 'history', 'nhat ky', 'log', 'lịch sử'],
    answer:
      'Menu **Lịch sử** liệt kê access log: thời gian, hướng Vào/Ra, biển số và trạng thái khớp mặt/biển.',
  },
  {
    keywords: ['nguoi dung', 'cu dan', 'resident', 'them nguoi', 'người dùng', 'cư dân'],
    answer:
      'Menu **Người dùng** để thêm, sửa, xóa cư dân, gắn phương tiện và đồng bộ dữ liệu nhận diện.',
  },
  {
    keywords: ['canh bao chay', 'chay', 'fire', 'cảnh báo cháy'],
    answer:
      'Biểu tượng ngọn lửa trên Header hiển thị trạng thái cảm biến cháy. Khi có tín hiệu, popup cảnh báo đỏ sẽ xuất hiện.',
  },
  {
    keywords: ['trang chu', 'dashboard', 'thong tin he thong', 'thông tin hệ thống'],
    answer:
      '**Trang chủ** hiển thị camera cổng vào/ra và tổng quan hoạt động. Bấm icon lưới 4 ô trên Header để mở popup **Thông tin hệ thống** (số cư dân, khách, xe vào/ra).',
  },
  {
    keywords: ['xin chao', 'hello', 'hi', 'chao', 'chào'],
    answer:
      'Xin chào! Tôi là trợ lý AI của SmartPark. Bạn có thể hỏi về hệ thống, cài đặt, RFID, camera hoặc lịch sử.',
  },
];

export const SUGGESTIONS = [
  'Hệ thống này là gì?',
  'Cài đặt ở đâu?',
  'RFID hoạt động thế nào?',
  'Xem lịch sử ở đâu?',
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAIResponse(userText) {
  const normalized = normalize(userText);

  for (const entry of FAQ_ENTRIES) {
    const matched = entry.keywords.some((kw) => normalized.includes(normalize(kw)));
    if (matched) return entry.answer;
  }

  return 'Tôi chưa hiểu câu hỏi này. Bạn thử hỏi: "Hệ thống này là gì?", "Cài đặt ở đâu?", "RFID hoạt động thế nào?" hoặc "Xem lịch sử ở đâu?".';
}
