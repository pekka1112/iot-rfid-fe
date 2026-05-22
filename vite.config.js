import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ==============================================================================
// CẤU HÌNH PROXY CAMERA IP
// Proxy giúp tránh lỗi CORS khi trình duyệt gọi thẳng vào camera.
//
// Camera 1 (Vào) : 192.168.1.108 — truy cập qua /cam1/...
// Camera 2 (Ra)  : Nếu cùng IP với camera 1, chỉ khác channel (101 vs 201)
//                  → Giữ nguyên target của /cam2.
//                  Nếu khác IP, đổi target của /cam2 sang IP camera thứ 2.
// ==============================================================================
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // ← thêm dòng này
    proxy: {
      // Camera Vào — Channel 1
      '/cam1': {
        target: 'http://192.168.1.108',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cam1/, ''),
        // Basic Auth — Vite tự thêm header Authorization
        auth: 'admin:Abc123456',
        // Bỏ qua lỗi SSL nếu camera dùng HTTPS tự ký
        secure: false,
      },
 
      // Camera Ra — Channel 2 (cùng thiết bị, endpoint /Streaming/Channels/201/...)
      // Nếu camera Ra có IP riêng, đổi target thành: 'http://192.168.1.XXX'
      '/cam2': {
        target: 'http://192.168.1.108',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cam2/, ''),
        auth: 'admin:Abc123456',
        secure: false,
      },
    },
  },
})
