# Calolator - Frontend

Đây là phần frontend của ứng dụng web Calolator, một AI chat hỗ trợ người dùng lên thực đơn bữa ăn hàng ngày dựa trên số calo mong muốn. Frontend được xây dựng bằng React.js và tương tác với backend API (để gọi model AI Vinallama) và Firebase (cho xác thực và lưu trữ lịch sử chat).

## Tính năng chính

*   **Giao diện Chat:** Gửi yêu cầu calo, hiển thị cuộc trò chuyện với AI.
*   **Xác thực người dùng:** Đăng ký, Đăng nhập bằng Email/Mật khẩu và Google.
*   **Quản lý lịch sử Chat:**
    *   Hiển thị danh sách các cuộc trò chuyện cũ trên sidebar.
    *   Tạo cuộc trò chuyện mới.
    *   Tải lại nội dung cuộc trò chuyện cũ.
    *   Xóa cuộc trò chuyện.
*   **Thiết kế Responsive:** Giao diện điều chỉnh tương đối tốt trên các kích thước màn hình khác nhau (với sidebar có thể đóng/mở).
*   **Tích hợp Firebase:** Sử dụng Firebase Authentication và Firestore Database.
*   **Modal:** Hiển thị Điều khoản dịch vụ và Chính sách riêng tư.

## Công nghệ sử dụng

*   **React.js:** Thư viện JavaScript để xây dựng giao diện người dùng.
*   **React Router DOM:** Quản lý routing phía client.
*   **Tailwind CSS:** Framework CSS utility-first để tạo kiểu nhanh chóng.
*   **Vite:** Công cụ build và development server frontend.
*   **Firebase SDK:** Tương tác với các dịch vụ Firebase (Auth, Firestore).
*   **Heroicons:** Bộ thư viện icon SVG.

## Điều kiện tiên quyết

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

*   **Node.js:** Phiên bản LTS (Long Term Support) được khuyến nghị. Bạn có thể tải từ [nodejs.org](https://nodejs.org/).
*   **npm** hoặc **yarn:** Trình quản lý gói Node.js (thường đi kèm với Node.js).
*   **Firebase Project:** Đã tạo một dự án trên [Firebase Console](https://console.firebase.google.com/) và đã bật các dịch vụ:
    *   **Authentication:** Kích hoạt phương thức đăng nhập Email/Password và Google Sign-in.
    *   **Firestore Database:** Tạo và cấu hình cơ sở dữ liệu Firestore.
*   **Backend API URL:** Địa chỉ URL của backend FastAPI đang chạy (ví dụ: URL `ngrok` từ Colab hoặc URL đã deploy).

## Cài đặt và Chạy Project

1.  **Clone Repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-project-frontend-directory> # Đi vào thư mục frontend
    ```

2.  **Cài đặt Dependencies:**
    Sử dụng npm:
    ```bash
    npm install
    ```
    Hoặc sử dụng yarn:
    ```bash
    yarn install
    ```

3.  **Cấu hình Biến Môi trường:**
    *   Tạo một file mới tên là `.env` trong thư mục gốc của frontend (cùng cấp với `package.json`).
    *   Sao chép nội dung dưới đây vào file `.env` và **thay thế các giá trị placeholder (`<...>`) bằng thông tin cấu hình Firebase thực tế của bạn** (lấy từ Firebase Console -> Project settings -> General -> Your apps -> SDK setup and configuration) và URL backend API:

    ```dotenv
    # Firebase Configuration
    VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
    VITE_FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
    VITE_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
    VITE_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
    VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
    VITE_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
    VITE_FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID> # Tùy chọn, nếu bạn dùng Analytics

    # Backend API URL (Bao gồm cả path endpoint)
    # Ví dụ với ngrok: https://<random-string>.ngrok-free.app/suggest-menu
    # Ví dụ khi deploy: https://your-backend-api.com/suggest-menu
    VITE_API_BACKEND_URL=<YOUR_BACKEND_API_URL>/suggest-menu
    ```
    *   **Quan trọng:** Không commit file `.env` lên Git repository của bạn vì nó chứa thông tin nhạy cảm. Đảm bảo file `.gitignore` của bạn có dòng `.env`.

4.  **Chạy Development Server:**
    Sử dụng npm:
    ```bash
    npm run dev
    ```
    Hoặc sử dụng yarn:
    ```bash
    yarn dev
    ```
    Ứng dụng sẽ khởi động và thường có sẵn tại địa chỉ `http://localhost:5173` (hoặc một cổng khác nếu 5173 đã được sử dụng). Mở trình duyệt và truy cập địa chỉ này.

    **Lưu ý:** Vì project đang sử dụng `ngrok` cho backend, URL `VITE_API_BACKEND_URL` sẽ thay đổi mỗi khi bạn khởi động lại tunnel. Bạn cần cập nhật file `.env` với URL `ngrok` mới mỗi lần.