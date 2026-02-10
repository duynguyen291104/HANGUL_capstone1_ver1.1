# Hướng Dẫn Cấu Hình và Chạy GitHub Actions

## 📋 Tổng Quan

Dự án đã được cấu hình với 3 GitHub Actions workflows:
1. **CI/CD Pipeline** - Kiểm tra code tự động
2. **Database Migration** - Quản lý database migrations
3. **Production Deploy** - Triển khai production

## 🔐 Bước 1: Cấu Hình GitHub Secrets

### Required Secrets (Bắt buộc)

Vào GitHub repository của bạn:
1. Click **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Thêm các secrets sau:

#### Database URLs
```
Name: PRODUCTION_DATABASE_URL
Value: postgresql://user:password@host:5432/database_name

Name: STAGING_DATABASE_URL  
Value: postgresql://user:password@host:5432/staging_db

Name: DEV_DATABASE_URL
Value: postgresql://user:password@host:5432/dev_db
```

#### Application URLs
```
Name: PRODUCTION_APP_URL
Value: https://your-production-url.com

Name: NEXTAUTH_SECRET
Value: your-random-secret-key-here
```

**Tạo NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Optional Secrets (Cho deployment)

#### Docker Hub (nếu dùng Docker)
```
Name: DOCKER_USERNAME
Value: your-dockerhub-username

Name: DOCKER_PASSWORD
Value: your-dockerhub-token-or-password
```

#### Vercel (nếu deploy lên Vercel)
```
Name: VERCEL_TOKEN
Value: your-vercel-token

Name: VERCEL_ORG_ID
Value: your-org-id

Name: VERCEL_PROJECT_ID
Value: your-project-id
```

**Lấy Vercel tokens:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login và link project
vercel login
vercel link

# Lấy thông tin
cat .vercel/project.json
```

## 🚀 Bước 2: Chạy CI/CD Workflows

### 1. CI/CD Pipeline (Tự động)

Workflow này chạy tự động khi:
- Push code vào `main` hoặc `develop` branch
- Tạo Pull Request vào `main` hoặc `develop`

**Hoặc chạy thủ công:**

1. Vào GitHub repository
2. Click tab **Actions**
3. Chọn **CI/CD Pipeline** từ sidebar
4. Click **Run workflow** button
5. Chọn branch muốn chạy
6. Click **Run workflow**

**Workflow sẽ:**
- ✅ Chạy ESLint và TypeScript checks
- ✅ Build ứng dụng với PostgreSQL test database
- ✅ Kiểm tra database migrations
- ✅ Scan security vulnerabilities
- ✅ Build Docker image (nếu có credentials)

### 2. Database Migration (Manual)

Workflow này dùng để quản lý database, chạy thủ công khi cần:

**Cách chạy:**

1. Vào **Actions** > **Database Migration**
2. Click **Run workflow**
3. Chọn:
   - **Environment**: development / staging / production
   - **Action**: 
     - `deploy` - Chạy migrations mới
     - `reset` - Reset database (⚠️ XÓA DATA)
     - `seed` - Seed dữ liệu mẫu
4. Click **Run workflow**

**Use cases:**
```
Staging:
  - Environment: staging
  - Action: deploy
  → Deploy migrations to staging

Production:
  - Environment: production  
  - Action: deploy
  → Deploy migrations to production

Development reset:
  - Environment: development
  - Action: reset
  → Reset dev database
```

### 3. Production Deploy (Tự động)

Workflow này chạy khi:
- Push vào `main` branch
- Tạo git tag (vd: `v1.0.0`)

**Hoặc chạy thủ công:**

1. Vào **Actions** > **Deploy to Production**
2. Click **Run workflow**
3. Chọn branch `main`
4. Click **Run workflow**

**Workflow sẽ:**
- ✅ Build production bundle
- ✅ Run database migrations
- ✅ Deploy to Vercel (nếu có config)
- ✅ Build và push Docker image (nếu có config)
- ✅ Health check

## 📊 Monitoring Workflow Results

### Xem Workflow Runs

1. Vào tab **Actions**
2. Chọn workflow từ sidebar
3. Xem list of runs:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - 🟡 Yellow dot = In progress

### Xem Chi Tiết

1. Click vào workflow run
2. Xem tất cả jobs
3. Click vào job để xem logs
4. Expand steps để xem chi tiết

### Notifications

GitHub sẽ tự động gửi email khi:
- Workflow fails
- Workflow succeeds (sau khi fail)

## 🔧 Testing Workflows Locally

### Test với act (GitHub Actions local runner)

```bash
# Install act
# Linux/WSL
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# macOS
brew install act

# Test workflow
act -l                          # List workflows
act push                        # Run push workflow
act -j build-and-test          # Run specific job
```

### Test Scripts Locally

```bash
# Test build
npm run build

# Test database
npm run db:migrate:prod
npm run db:seed

# Test Docker build
docker build -t test-image .
docker run -p 3000:3000 test-image
```

## 🐛 Troubleshooting

### Workflow fails với "Authentication failed"

**Nguyên nhân:** Database URL secrets chưa đúng

**Giải pháp:**
1. Check secrets đã thêm chưa
2. Verify database URL format:
   ```
   postgresql://username:password@host:port/database
   ```
3. Test connection locally:
   ```bash
   psql "postgresql://username:password@host:port/database"
   ```

### Workflow fails với "Module not found"

**Nguyên nhân:** Dependencies chưa được cài

**Giải pháp:**
1. Check `package.json` có đúng dependencies
2. Clear cache và retry:
   - Vào Actions settings
   - Clear caches
   - Re-run workflow

### Docker build fails

**Nguyên nhân:** Docker credentials không đúng

**Giải pháp:**
1. Check `DOCKER_USERNAME` và `DOCKER_PASSWORD` secrets
2. Verify Docker Hub access
3. Check Dockerfile syntax

### Migration fails

**Nguyên nhân:** Database schema conflict

**Giải pháp:**
1. Check migration files trong `prisma/migrations/`
2. Verify database state
3. Có thể cần reset database:
   ```bash
   # Locally first
   npm run db:reset
   
   # Then deploy fresh migration
   ```

## 📝 Workflow Configuration Files

### 1. CI/CD Pipeline
**File:** `.github/workflows/ci-cd.yml`

**Triggers:**
```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:  # Manual trigger
```

**Jobs:**
- `lint` - Code quality checks
- `build-and-test` - Build với test database
- `database-check` - Validate migrations
- `security` - Security scanning
- `docker-build` - Build Docker image
- `notify` - Send notifications

### 2. Database Migration
**File:** `.github/workflows/database-migration.yml`

**Triggers:**
```yaml
on:
  workflow_dispatch:
    inputs:
      environment: [development, staging, production]
      action: [deploy, reset, seed]
```

**Jobs:**
- `migrate` - Run database operations

### 3. Deploy
**File:** `.github/workflows/deploy.yml`

**Triggers:**
```yaml
on:
  push:
    branches: [main]
    tags: ['v*.*.*']
  workflow_dispatch:
```

**Jobs:**
- `deploy` - Build and deploy to production

## ✅ Verification Checklist

Sau khi setup, verify:

- [ ] All secrets đã được thêm vào GitHub
- [ ] Workflows đều visible trong Actions tab
- [ ] Test run một workflow thành công
- [ ] Database migrations chạy được
- [ ] Build thành công
- [ ] Security scan pass
- [ ] Deployment config đúng (Vercel/Docker)

## 🎯 Best Practices

### 1. Branch Strategy
```
main          → Production deployments
develop       → Staging/Dev deployments  
feature/*     → Feature development
```

### 2. Migration Strategy
```
Development   → Test migrations locally first
Staging       → Deploy & test on staging
Production    → Deploy to production
```

### 3. Secrets Management
- ✅ Sử dụng GitHub Secrets cho sensitive data
- ✅ Không commit secrets vào code
- ✅ Rotate secrets định kỳ
- ✅ Sử dụng environment-specific secrets

### 4. Workflow Optimization
- ✅ Cache dependencies để build nhanh hơn
- ✅ Run jobs parallel khi có thể
- ✅ Skip jobs không cần thiết
- ✅ Use matrix builds cho multi-version testing

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 Need Help?

Nếu gặp vấn đề:
1. Check workflow logs trong Actions tab
2. Xem [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting
3. Test commands locally trước
4. Check GitHub Actions status: https://www.githubstatus.com/

---

**Last Updated:** 2026-02-10
**Version:** 1.0.0
