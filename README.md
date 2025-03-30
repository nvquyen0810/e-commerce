# E-commerce Admin Dashboard

Dự án E-commerce Admin Dashboard được xây dựng với React và NestJS.

## Yêu cầu hệ thống

- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn
- MongoDB (phiên bản 4.x trở lên)

## Cài đặt và Chạy Project

### 1. Backend (NestJS)

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt các dependencies
npm install

# Chạy server ở chế độ development
npm run start:dev
```

Server sẽ chạy tại địa chỉ: http://localhost:3000

### 2. Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd backend/public/admin

# Cài đặt các dependencies
npm install

# Build project cho production
npm run build

# Hoặc chạy ở chế độ development
npm start
```

Frontend sẽ chạy tại địa chỉ: http://localhost:3001

## Cấu trúc Project

```
├── backend/                # NestJS backend
│   ├── src/               # Source code
│   ├── public/            # Static files
│   │   └── admin/        # React admin dashboard
│   └── package.json      # Dependencies
└── README.md             # Bạn đang ở đây
```

## API Endpoints

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/logout` - Đăng xuất

## Tính năng

- Xác thực người dùng (Authentication)
- Quản lý sản phẩm
- Quản lý đơn hàng
- Quản lý người dùng
- Dashboard với thống kê

## Liên hệ

- GitHub: [nvquyen](https://github.com/nvquyen)