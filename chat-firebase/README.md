
# Tài Liệu Thư Mục Emulator

Thư mục `emulator` được sử dụng để thiết lập và quản lý các trình giả lập Firebase cho phát triển và kiểm thử cục bộ. Điều này cho phép bạn mô phỏng các dịch vụ Firebase trên máy tính của mình mà không ảnh hưởng đến môi trường thực tế.


## Hướng Dẫn Thiết Lập

1. **Cài Đặt Firebase Tools**

   Đảm bảo bạn đã cài đặt Firebase CLI toàn cầu:
   ```bash
   npm install -g firebase-tools
   ```

2. **Đăng Nhập Với Firebase**

   Đăng nhập với tài khoản Firebase của bạn:
   ```bash
   firebase login
   ```

3. **Khởi Tạo Dự Án Firebase**

   Khởi tạo dự án Firebase của bạn:
   ```bash
   firebase init
   ```

4. **Khởi Động Các Emulator**

   Khởi động các emulator để chạy trên máy của bạn:
   ```bash
   firebase emulators:start
   ```

## Cấu Hình Trình Giả Lập

- **Tệp Cấu Hình**: Các cài đặt giả lập được lưu trong tệp `firebase.json`. Bạn có thể tùy chỉnh các trình giả lập cần chạy và các cổng tương ứng.


- **Truy Cập Giao Diện Người Dùng**: Sau khi khởi động, bạn có thể truy cập Giao diện Người dùng Emulator tại `http://localhost:4000` (cổng mặc định) để xem và tương tác với các dịch vụ giả lập.


## Thực Hành Tốt

- **Tách Biệt Môi Trường**: Sử dụng trình giả lập cho phát triển cục bộ để tránh thay đổi dữ liệu sản xuất một cách vô ý.

- **Kiểm Thử**: Trình giả lập lý tưởng cho việc kiểm thử các tính năng mới và gỡ lỗi mà không ảnh hưởng đến người dùng thực tế.


- **Quản Lý Phiên Bản**: Giữ `firebase.json` và bất kỳ script liên quan đến giả lập nào dưới sự quản lý phiên bản để đảm bảo tính nhất quán giữa các môi trường phát triển.


## Xử Lý Sự Cố

- **Xung Đột Cổng**: Nếu gặp xung đột cổng, điều chỉnh các cổng trong tệp `firebase.json`.


- **Vấn Đề Xác Thực**: Đảm bảo bạn đã đăng nhập vào tài khoản Firebase chính xác bằng `firebase login`.

Để biết thêm thông tin chi tiết, tham khảo [tài liệu Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite).


Hãy điều chỉnh nội dung để phù hợp hơn với nhu cầu cụ thể của dự án của bạn!
