# Hướng Dẫn Triển Khai Database và CI/CD

## 📋 Mục Lục
1. [Cấu Hình Database](#cấu-hình-database)
2. [Cài Đặt và Khởi Động](#cài-đặt-và-khởi-động)
3. [Prisma Commands](#prisma-commands)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Docker Deployment](#docker-deployment)
6. [Troubleshooting](#troubleshooting)

## 🗄️ Cấu Hình Database

### 1. Khởi động PostgreSQL với Docker

```bash
# Khởi động database
npm run docker:up

# Xem logs
npm run docker:logs

# Dừng database
npm run docker:down
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Chỉnh sửa các giá trị trong `.env`:
```env
DATABASE_URL="postgresql://topik_user:topik_password_2024@localhost:5432/topik_learning_db"
```

### 3. Truy cập pgAdmin (Optional)

- URL: http://localhost:5050
- Email: admin@topik.local
- Password: admin123

## 🚀 Cài Đặt và Khởi Động

### Bước 1: Cài đặt dependencies

```bash
npm install
```

### Bước 2: Khởi động Docker containers

```bash
# Chỉ PostgreSQL
npm run docker:up

# Bao gồm cả pgAdmin và Redis
docker-compose --profile dev up -d
```

### Bước 3: Chạy Prisma migrations

```bash
# Generate Prisma Client
npm run db:generate

# Chạy migrations
npm run db:migrate

# Hoặc push schema trực tiếp (development)
npm run db:push
```

### Bước 4: Seed dữ liệu mẫu

```bash
npm run db:seed
```

### Bước 5: Khởi động ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 🔧 Prisma Commands

### Quản lý Database Schema

```bash
# Generate Prisma Client sau khi thay đổi schema
npm run db:generate

# Push schema changes to database (dev only)
npm run db:push

# Create migration from schema changes
npm run db:migrate

# Deploy migrations to production
npm run db:migrate:prod

# Reset database (⚠️ Xóa toàn bộ data)
npm run db:reset
```

### Database Studio (GUI)

```bash
# Mở Prisma Studio để xem/chỉnh sửa data
npm run db:studio
```

Truy cập: http://localhost:5555

### Seed Database

```bash
# Chạy seed script
npm run db:seed
```

## 🔄 GitHub Actions CI/CD

Dự án có 3 workflows chính:

### 1. CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Trigger:** Push hoặc Pull Request vào `main` hoặc `develop`

**Jobs:**
- ✅ **Lint & Code Quality**: ESLint, TypeScript check
- ✅ **Build & Test**: Build app với PostgreSQL
- ✅ **Database Check**: Kiểm tra migrations
- ✅ **Security Scan**: npm audit, secrets scan
- ✅ **Docker Build**: Build Docker images
- ✅ **Notify**: Thông báo kết quả

**Chạy thủ công:**
```bash
# Trigger từ GitHub UI: Actions > CI/CD Pipeline > Run workflow
```

### 2. Database Migration (`.github/workflows/database-migration.yml`)

**Trigger:** Manual workflow dispatch

**Sử dụng:**
1. Vào GitHub Actions
2. Chọn "Database Migration"
3. Click "Run workflow"
4. Chọn environment và action:
   - Environment: development/staging/production
   - Action: deploy/reset/seed

### 3. Deploy to Production (`.github/workflows/deploy.yml`)

**Trigger:** 
- Push vào `main` branch
- Git tags (v*.*.*)
- Manual dispatch

**Bước triển khai:**
1. Build application
2. Run migrations
3. Deploy to Vercel/Docker
4. Health check

## 🔐 GitHub Secrets Configuration

Để CI/CD hoạt động, cấu hình các secrets trong GitHub:

### Required Secrets:

```
PRODUCTION_DATABASE_URL    # PostgreSQL connection string for production
STAGING_DATABASE_URL       # PostgreSQL connection string for staging
DEV_DATABASE_URL          # PostgreSQL connection string for development

PRODUCTION_APP_URL        # Production app URL
NEXTAUTH_SECRET          # NextAuth secret key

# Optional - For Docker Hub
DOCKER_USERNAME          # Docker Hub username
DOCKER_PASSWORD          # Docker Hub password/token

# Optional - For Vercel
VERCEL_TOKEN            # Vercel deployment token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
```

### Cách thêm secrets:
1. Vào GitHub repository
2. Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Thêm từng secret

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t topik-learning-app .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3000" \
  topik-learning-app
```

### Docker Compose (Full Stack)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (⚠️ Xóa data)
docker-compose down -v
```

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Vocabulary
```
GET    /api/vocabulary           # Lấy danh sách từ vựng
POST   /api/vocabulary           # Thêm từ vựng mới
GET    /api/vocabulary/:id       # Lấy chi tiết từ vựng
PUT    /api/vocabulary/:id       # Cập nhật từ vựng
DELETE /api/vocabulary/:id       # Xóa từ vựng
```

### Progress
```
GET    /api/progress             # Lấy tiến độ học tập
POST   /api/progress             # Cập nhật tiến độ
```

### Stats
```
GET    /api/stats                # Lấy thống kê người dùng
PUT    /api/stats                # Cập nhật thống kê
```

### Games
```
GET    /api/games                # Lấy kết quả games
POST   /api/games                # Lưu kết quả game
```

## 🧪 Testing

### Test Database Connection

```bash
# Test với Prisma
npx prisma db pull

# Test với psql
psql postgresql://topik_user:topik_password_2024@localhost:5432/topik_learning_db
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Get vocabulary
curl http://localhost:3000/api/vocabulary

# Get stats
curl http://localhost:3000/api/stats
```

## 🔍 Troubleshooting

### Database Connection Issues

**Lỗi: "Can't reach database server"**
```bash
# Kiểm tra Docker container
docker ps

# Xem logs PostgreSQL
docker logs topik-postgres

# Restart container
docker restart topik-postgres
```

**Lỗi: "Database does not exist"**
```bash
# Tạo lại database
npm run db:push
npm run db:seed
```

### Prisma Issues

**Lỗi: "Prisma Client not generated"**
```bash
npm run db:generate
```

**Lỗi: "Migration failed"**
```bash
# Reset và migrate lại
npm run db:reset
npm run db:migrate
```

### Port Already in Use

```bash
# Tìm process sử dụng port 5432
lsof -i :5432

# Kill process
kill -9 <PID>

# Hoặc thay đổi port trong docker-compose.yml
```

### Clear All Data and Restart

```bash
# Stop containers
docker-compose down -v

# Remove all volumes
docker volume prune

# Start fresh
npm run docker:up
npm run db:push
npm run db:seed
npm run dev
```

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com)

## 🎯 Quick Start Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Install dependencies: `npm install`
- [ ] Start Docker: `npm run docker:up`
- [ ] Generate Prisma Client: `npm run db:generate`
- [ ] Run migrations: `npm run db:migrate`
- [ ] Seed database: `npm run db:seed`
- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Configure GitHub secrets for CI/CD
- [ ] Test workflows in GitHub Actions

## 📝 Notes

1. **Development**: Sử dụng `db:push` cho development để sync schema nhanh
2. **Production**: Luôn sử dụng `db:migrate:prod` để deploy migrations
3. **Backup**: Thường xuyên backup database production
4. **Security**: Không commit file `.env` vào Git
5. **Testing**: Test migrations trên staging trước khi deploy production

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request
6. CI/CD sẽ tự động chạy tests

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-10
