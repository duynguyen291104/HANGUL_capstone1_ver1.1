# 🚀 Quick Start Guide

## Khởi Động Nhanh (5 phút)

### Bước 1: Clone và Cài Đặt
```bash
git clone <repository-url>
cd korean-topik-learning-app
npm install
```

### Bước 2: Chạy Setup Script
```bash
./setup.sh
```

Script sẽ tự động:
- ✅ Kiểm tra dependencies
- ✅ Tạo file .env
- ✅ Khởi động PostgreSQL
- ✅ Chạy migrations
- ✅ Seed 1,164 từ vựng
- ✅ Start dev server

### Bước 3: Mở Ứng Dụng
```
http://localhost:3000
```

## Hoặc Setup Thủ Công

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start database
npm run docker:up

# 3. Run migrations
npm run db:migrate

# 4. Seed data
npm run db:seed

# 5. Start app
npm run dev
```

## Các Lệnh Quan Trọng

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build production
npm run db:studio        # Open database GUI

# Docker
npm run docker:up        # Start containers
npm run docker:down      # Stop containers
npm run docker:logs      # View logs

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed data
npm run db:reset         # Reset database
```

## Truy Cập

- **App**: http://localhost:3000
- **Prisma Studio**: `npm run db:studio` → http://localhost:5555
- **pgAdmin**: http://localhost:5050 (email: admin@topik.local, pass: admin123)
- **Database**: postgresql://topik_user:topik_password_2024@localhost:5432/topik_learning_db

## API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Get vocabulary
curl http://localhost:3000/api/vocabulary

# Get stats
curl http://localhost:3000/api/stats
```

## Tài Liệu

- [README.md](./README.md) - Tổng quan dự án
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Hướng dẫn triển khai chi tiết
- [GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md) - Hướng dẫn CI/CD
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Tổng kết setup

## Troubleshooting

**Database connection error?**
```bash
docker ps                # Check container running
docker logs topik-postgres  # Check logs
npm run docker:up        # Restart if needed
```

**Port already in use?**
```bash
lsof -i :3000           # Find process
kill -9 <PID>           # Kill process
```

**Build errors?**
```bash
rm -rf node_modules .next
npm install
npm run build
```

Xem [DEPLOYMENT.md](./DEPLOYMENT.md) để biết thêm chi tiết.
