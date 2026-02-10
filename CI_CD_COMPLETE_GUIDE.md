# 📘 QUY TRÌNH CI/CD - HƯỚNG DẪN TOÀN DIỆN

## 🎯 Mục Đích Tài Liệu

Tài liệu này cung cấp hướng dẫn **chi tiết và đầy đủ** về quy trình CI/CD đã được thiết lập cho dự án Korean TOPIK Learning App, bao gồm cách cấu hình, chạy, và troubleshoot tất cả workflows.

---

## 📊 TỔNG QUAN HỆ THỐNG CI/CD

### Kiến Trúc CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Push    │  │   PR     │  │ Manual   │                   │
│  │  main    │  │ Request  │  │ Trigger  │                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
└───────┼─────────────┼─────────────┼────────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS WORKFLOWS                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. CI/CD Pipeline (ci-cd.yml)                       │   │
│  │    ├─ Lint & Code Quality                           │   │
│  │    ├─ Build & Test (PostgreSQL)                     │   │
│  │    ├─ Database Migration Check                      │   │
│  │    ├─ Security Scan                                 │   │
│  │    ├─ Docker Build                                  │   │
│  │    └─ Notification                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 2. Database Migration (database-migration.yml)      │   │
│  │    ├─ Deploy Migrations                             │   │
│  │    ├─ Reset Database                                │   │
│  │    └─ Seed Data                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 3. Production Deploy (deploy.yml)                   │   │
│  │    ├─ Build Production                              │   │
│  │    ├─ Run Migrations                                │   │
│  │    ├─ Deploy (Vercel/Docker)                        │   │
│  │    └─ Health Check                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                   DEPLOYMENT TARGETS                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Vercel  │  │  Docker  │  │   AWS    │                   │
│  │  Cloud   │  │   Hub    │  │   ECS    │                   │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 WORKFLOW 1: CI/CD PIPELINE

**File:** `.github/workflows/ci-cd.yml`

### Mô Tả
Workflow chính để kiểm tra code quality, build, test và security scanning.

### Kích Hoạt Tự Động

```yaml
Triggers:
✅ Push vào branch main hoặc develop
✅ Pull Request vào main hoặc develop
✅ Manual dispatch (chạy thủ công)
```

### Chi Tiết Các Jobs

#### Job 1: Lint & Code Quality ⚙️

```yaml
Mục đích: Kiểm tra code quality
Thời gian: ~30s

Steps:
1. Checkout code từ repository
2. Setup Node.js 20.x với npm cache
3. Install dependencies
4. Run ESLint
5. Check TypeScript compilation

Outputs:
- ESLint warnings/errors
- TypeScript type errors

Continue on error: Yes (không fail workflow)
```

**Ví dụ output:**
```bash
✓ ESLint check completed
✓ TypeScript compilation successful
  No errors found!
```

#### Job 2: Build & Test 🏗️

```yaml
Mục đích: Build app và test với PostgreSQL
Thời gian: ~2-3 phút

Services:
- PostgreSQL 16 container
  Port: 5432
  Health check: pg_isready

Steps:
1. Checkout code
2. Setup Node.js với cache
3. Install dependencies
4. Setup environment variables
5. Generate Prisma Client
6. Run database migrations
7. Seed test data
8. Build Next.js application
9. Upload build artifacts

Environment Variables:
- DATABASE_URL=postgresql://test_user:test_password@localhost:5432/test_db
- NEXT_PUBLIC_APP_URL=http://localhost:3000

Artifacts:
- .next/ folder
- public/ folder
Retention: 7 days
```

**Ví dụ output:**
```bash
✓ Database migrations applied
✓ Test data seeded
✓ Next.js build successful
  - 21 routes generated
  - Build time: 10.2s
  - Bundle size: 2.1 MB
```

#### Job 3: Database Check 🗄️

```yaml
Mục đích: Validate database migrations
Thời gian: ~1 phút

Services:
- PostgreSQL 16 container (migration_db)

Steps:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Check Prisma schema format
5. Generate Prisma Client
6. Deploy migrations
7. Validate database schema

Commands:
- npx prisma format --check
- npm run db:generate
- npm run db:migrate:prod
- npx prisma validate

Purpose:
- Đảm bảo schema.prisma đúng format
- Migrations không có lỗi
- Database schema hợp lệ
```

**Ví dụ output:**
```bash
✓ Prisma schema format valid
✓ Migrations deployed successfully
  Applied 1 migration:
  - 20260210163630_init
✓ Database schema validated
```

#### Job 4: Security Scan 🔒

```yaml
Mục đích: Scan security vulnerabilities
Thời gian: ~45s

Steps:
1. Checkout code
2. Setup Node.js
3. Run npm audit (moderate level)
4. Run TruffleHog (secrets scanner)

Tools:
- npm audit: Kiểm tra vulnerable dependencies
- TruffleHog: Scan secrets trong code

Continue on error: Yes
```

**Ví dụ output:**
```bash
npm audit report:
  0 vulnerabilities found
  
TruffleHog scan:
  No secrets detected
  ✓ Repository is clean
```

#### Job 5: Docker Build 🐳

```yaml
Mục đích: Build Docker image
Thời gian: ~3-5 phút
Chỉ chạy khi: Push vào main/develop

Steps:
1. Checkout code
2. Setup Docker Buildx
3. Login to Docker Hub (if credentials exist)
4. Extract metadata (tags, labels)
5. Build Docker image
6. Push to Docker Hub (optional)

Cache:
- Type: GitHub Actions cache
- Mode: max (cache all layers)

Tags:
- branch name (main, develop)
- git sha
- semantic version (if tag)
```

**Ví dụ output:**
```bash
Building image: topik-learning-app:main
✓ Layer 1/15 cached
✓ Layer 2/15 cached
...
✓ Build completed: 3m 24s
✓ Image size: 245 MB
```

#### Job 6: Notification 📢

```yaml
Mục đích: Thông báo kết quả
Thời gian: ~5s
Chạy: Always (kể cả khi jobs khác fail)

Dependencies: All previous jobs

Logic:
if (build-and-test == success && database-check == success):
  ✅ "All checks passed! Ready for deployment"
else:
  ❌ "Some checks failed. Please review logs"
  exit 1
```

---

## 🗄️ WORKFLOW 2: DATABASE MIGRATION

**File:** `.github/workflows/database-migration.yml`

### Mô Tả
Workflow để quản lý database operations trên nhiều môi trường.

### Kích Hoạt

```yaml
Trigger: Manual dispatch only

Inputs:
1. environment (required)
   - development
   - staging
   - production
   
2. action (required)
   - deploy: Chạy migrations
   - reset: Reset database (⚠️ XÓA DATA)
   - seed: Seed dữ liệu mẫu
```

### Quy Trình Chi Tiết

```yaml
Job: migrate

Steps:
1. Checkout code
2. Setup Node.js 20.x
3. Install dependencies
4. Setup environment based on input
   - production → PRODUCTION_DATABASE_URL
   - staging → STAGING_DATABASE_URL
   - development → DEV_DATABASE_URL
5. Generate Prisma Client
6. Execute action:
   a) Deploy: npm run db:migrate:prod
   b) Reset: npm run db:reset --force
   c) Seed: npm run db:seed
7. Verify migration
8. Generate summary report

Environment Variables (từ Secrets):
- DATABASE_URL (dynamic based on environment)

Output:
- Migration summary in GitHub Actions UI
- Success/failure status
```

### Use Cases

#### Case 1: Deploy Migration to Production
```yaml
Input:
  environment: production
  action: deploy

Process:
1. Load PRODUCTION_DATABASE_URL from secrets
2. Generate Prisma Client
3. Run: prisma migrate deploy
4. Verify: prisma validate

Result:
✅ Migrations deployed to production
   Applied 2 new migrations:
   - 20260210_add_user_level
   - 20260210_add_sentence_table
```

#### Case 2: Reset Staging Database
```yaml
Input:
  environment: staging
  action: reset

Process:
1. Load STAGING_DATABASE_URL
2. Run: prisma migrate reset --force
3. Re-apply all migrations
4. Run seed script

Result:
⚠️ Database reset completed
   All data cleared
   Migrations re-applied
   Seed data loaded
```

#### Case 3: Seed Development Data
```yaml
Input:
  environment: development
  action: seed

Process:
1. Load DEV_DATABASE_URL
2. Run: tsx prisma/seed.ts
3. Verify data loaded

Result:
✅ Seed completed
   - 1,164 vocabulary items
   - 1 demo user
   - 5 sample sentences
   - 6 game results
```

---

## 🚀 WORKFLOW 3: PRODUCTION DEPLOY

**File:** `.github/workflows/deploy.yml`

### Mô Tả
Workflow để deploy ứng dụng lên production.

### Kích Hoạt

```yaml
Triggers:
✅ Push vào main branch
✅ Git tags (v*.*.*)
✅ Manual dispatch

Environment: production (với protection rules)
```

### Quy Trình Deploy Chi Tiết

```yaml
Job: deploy

Steps:
1. Checkout code
2. Setup Node.js 20.x với cache
3. Install dependencies
4. Setup environment variables:
   - DATABASE_URL → PRODUCTION_DATABASE_URL
   - NEXT_PUBLIC_APP_URL → PRODUCTION_APP_URL
   - NEXTAUTH_SECRET → NEXTAUTH_SECRET
5. Generate Prisma Client
6. Run database migrations (production)
7. Build Next.js application (production mode)
8. Deploy to platform:
   Option A: Vercel
   Option B: Docker Hub
9. Generate deployment summary

Environment Variables Required:
- PRODUCTION_DATABASE_URL
- PRODUCTION_APP_URL
- NEXTAUTH_SECRET
- VERCEL_TOKEN (optional)
- VERCEL_ORG_ID (optional)
- VERCEL_PROJECT_ID (optional)
- DOCKER_USERNAME (optional)
- DOCKER_PASSWORD (optional)
```

### Deploy Options

#### Option A: Vercel Deployment

```yaml
Uses: amondnet/vercel-action@v25

Process:
1. Authenticate với Vercel token
2. Link to project (org-id + project-id)
3. Deploy với --prod flag
4. Get deployment URL
5. Run health check

Commands:
vercel --token=$VERCEL_TOKEN \
  --scope=$VERCEL_ORG_ID \
  --project=$VERCEL_PROJECT_ID \
  --prod

Result:
✅ Deployed to Vercel
   URL: https://korean-topik-app.vercel.app
   Status: Ready
```

#### Option B: Docker Deployment

```yaml
Process:
1. Login to Docker Hub
2. Build production image:
   docker build -t username/topik-learning-app:latest .
3. Push image:
   docker push username/topik-learning-app:latest
4. Tag with version (if git tag exists)

Tags:
- latest
- git sha (abc123f)
- version (v1.0.0)

Result:
✅ Docker image pushed
   Image: username/topik-learning-app:latest
   Size: 245 MB
   Tags: latest, v1.0.0, abc123f
```

### Deployment Summary

```yaml
GitHub Summary Output:
## 🚀 Deployment Summary
- Environment: Production
- Version: v1.0.0 (or main)
- Commit: abc123f
- Status: ✅ Deployed successfully
- URL: https://your-app.com
- Time: 2026-02-10 16:45:23 UTC
```

---

## 📝 HƯỚNG DẪN SỬ DỤNG WORKFLOWS

### Bước 1: Cấu Hình GitHub Secrets

**Vào Repository Settings:**

1. Click **Settings** tab
2. Sidebar: **Secrets and variables** > **Actions**
3. Click **New repository secret**

**Thêm các secrets sau:**

#### Required Secrets (Bắt buộc)

```bash
# Database URLs
PRODUCTION_DATABASE_URL
Value: postgresql://user:pass@host:5432/prod_db
Sử dụng: Deploy workflow, Database migration

STAGING_DATABASE_URL
Value: postgresql://user:pass@host:5432/staging_db
Sử dụng: Database migration

DEV_DATABASE_URL
Value: postgresql://user:pass@host:5432/dev_db
Sử dụng: Database migration

# Application Settings
PRODUCTION_APP_URL
Value: https://your-production-domain.com
Sử dụng: Deploy workflow

NEXTAUTH_SECRET
Value: <random-32-character-string>
Sử dụng: Deploy workflow
Tạo bằng: openssl rand -base64 32
```

#### Optional Secrets (Cho deployment)

```bash
# Docker Hub (nếu dùng Docker)
DOCKER_USERNAME
Value: your-docker-username

DOCKER_PASSWORD
Value: your-docker-token

# Vercel (nếu deploy lên Vercel)
VERCEL_TOKEN
Value: your-vercel-token
Lấy từ: https://vercel.com/account/tokens

VERCEL_ORG_ID
Value: team_xxxxxxxxxxxxx
Lấy từ: .vercel/project.json

VERCEL_PROJECT_ID  
Value: prj_xxxxxxxxxxxxx
Lấy từ: .vercel/project.json
```

### Bước 2: Chạy Workflows

#### A. CI/CD Pipeline (Tự động)

**Tự động chạy khi:**
```bash
# Push code
git add .
git commit -m "feat: add new feature"
git push origin main
→ Workflow tự động chạy

# Tạo Pull Request
gh pr create --title "New feature"
→ Workflow tự động chạy
```

**Chạy thủ công:**
```bash
1. Vào tab Actions
2. Chọn "CI/CD Pipeline"
3. Click "Run workflow"
4. Chọn branch (main/develop)
5. Click "Run workflow" button
```

#### B. Database Migration (Manual)

**Kịch bản 1: Deploy migration lên Production**
```bash
Steps:
1. Vào Actions tab
2. Chọn "Database Migration"
3. Click "Run workflow"
4. Input:
   - Environment: production
   - Action: deploy
5. Click "Run workflow"
6. Đợi ~1-2 phút
7. Check logs để verify

Expected Output:
✅ Migration deployed
   Applied 1 migration
   Database schema updated
```

**Kịch bản 2: Seed Staging Data**
```bash
Steps:
1. Vào Actions tab
2. Chọn "Database Migration"
3. Click "Run workflow"
4. Input:
   - Environment: staging
   - Action: seed
5. Click "Run workflow"

Expected Output:
✅ Seed completed
   1,164 vocabulary items added
   Test data ready
```

**Kịch bản 3: Reset Development Database**
```bash
⚠️ WARNING: This will DELETE all data

Steps:
1. Actions > Database Migration
2. Run workflow
3. Input:
   - Environment: development
   - Action: reset
4. Confirm và run

Expected Output:
⚠️ Database reset successful
   All data cleared
   Migrations re-applied
   Ready for fresh start
```

#### C. Production Deploy (Automatic/Manual)

**Tự động deploy:**
```bash
# Merge PR vào main
git checkout main
git merge feature-branch
git push origin main
→ Deploy workflow tự động chạy

# Hoặc tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
→ Deploy workflow chạy với version tag
```

**Deploy thủ công:**
```bash
1. Actions > Deploy to Production
2. Click "Run workflow"
3. Select branch: main
4. Click "Run workflow"
5. Đợi 3-5 phút
6. Check deployment URL

Expected Output:
✅ Deployed successfully
   URL: https://your-app.vercel.app
   Version: v1.0.0
   Status: Healthy
```

### Bước 3: Monitor Workflow Execution

#### Xem Real-time Progress

```bash
1. Click vào workflow run đang chạy
2. Xem overview:
   - Status của từng job
   - Thời gian chạy
   - Logs
3. Click vào job để xem chi tiết
4. Expand steps để xem output
```

#### Hiểu Workflow Status Icons

```bash
🟡 Yellow dot    = Running
✅ Green check   = Success
❌ Red X         = Failed
⚪ Gray circle  = Pending/Skipped
⏸️ Pause icon   = Cancelled
```

#### Check Logs

```bash
View Logs:
1. Click vào failed step (red X)
2. Expand để xem error message
3. Scroll để tìm root cause

Common Error Patterns:
❌ "Authentication failed" → Check database URL secret
❌ "Module not found" → Dependencies issue
❌ "Migration failed" → Schema conflict
❌ "Build failed" → TypeScript errors
```

---

## 🔍 TROUBLESHOOTING GUIDE

### Issue 1: Database Connection Failed

**Error:**
```bash
Error: P1000: Authentication failed against database server
```

**Giải pháp:**

```bash
1. Verify secret exists:
   Settings > Secrets > Check DATABASE_URL

2. Test connection locally:
   psql "$DATABASE_URL"

3. Check format:
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   
4. Common mistakes:
   ❌ postgresql://user@host/db  (missing password)
   ❌ postgresql://user:pass@host (missing port/database)
   ✅ postgresql://user:pass@host:5432/db

5. Re-create secret with correct value
```

### Issue 2: Build Failed - Dependencies

**Error:**
```bash
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
```

**Giải pháp:**

```bash
1. Check package.json có conflicts không
2. Local test:
   rm -rf node_modules package-lock.json
   npm install
   npm run build

3. Nếu local OK, clear GitHub cache:
   Actions > Caches > Delete all caches

4. Re-run workflow
```

### Issue 3: Migration Conflict

**Error:**
```bash
Error: Migration '20260210_init' already exists
```

**Giải pháp:**

```bash
Option A: Skip if already applied
- Prisma tự động skip migrations đã apply
- Không cần action

Option B: Force reset (⚠️ CAREFUL)
1. Run Database Migration workflow
2. Environment: staging (test first!)
3. Action: reset
4. Verify data loss acceptable
5. Re-run deploy

Option C: Resolve manually
1. SSH to database server
2. Check migration table:
   SELECT * FROM _prisma_migrations;
3. Remove conflicting entry if needed
4. Re-run migration
```

### Issue 4: Docker Build Out of Memory

**Error:**
```bash
Error: process out of memory
```

**Giải pháp:**

```bash
1. Optimize Dockerfile:
   - Use .dockerignore
   - Multi-stage builds
   - Remove dev dependencies in prod

2. GitHub Actions có giới hạn:
   - Memory: 7 GB
   - Disk: 14 GB
   
3. Optimize build:
   # Add to Dockerfile
   ENV NODE_OPTIONS="--max-old-space-size=4096"

4. Split build steps if needed
```

### Issue 5: Vercel Deploy Failed

**Error:**
```bash
Error: Project not found
```

**Giải pháp:**

```bash
1. Verify Vercel secrets:
   - VERCEL_TOKEN có đúng không?
   - VERCEL_ORG_ID đúng format?
   - VERCEL_PROJECT_ID tồn tại?

2. Get correct values:
   vercel login
   vercel link
   cat .vercel/project.json

3. Update secrets với values từ file trên

4. Test locally:
   vercel --token=$TOKEN --scope=$ORG_ID --prod
```

---

## 📊 BEST PRACTICES

### 1. Branch Strategy

```bash
Recommended Flow:
main (production)
  ↑
develop (staging)
  ↑
feature/* (development)

Workflow:
1. Create feature branch từ develop
2. Develop locally, test
3. Push → CI/CD pipeline chạy
4. Create PR to develop
5. Review, merge → Deploy to staging
6. Test trên staging
7. PR to main → Deploy to production
```

### 2. Migration Strategy

```bash
Safe Migration Process:
1. Develop migration locally
   npm run db:migrate

2. Test migration:
   npm run db:reset
   npm run db:migrate
   npm run db:seed

3. Push to GitHub

4. Deploy to staging:
   Actions > Database Migration
   Environment: staging
   Action: deploy

5. Test trên staging thoroughly

6. Deploy to production:
   Actions > Database Migration
   Environment: production
   Action: deploy

7. Verify production data intact
```

### 3. Secrets Management

```bash
Security Best Practices:
✅ Use GitHub Secrets (encrypted)
✅ Different secrets per environment
✅ Rotate secrets định kỳ (3-6 months)
✅ Minimum permission principle
❌ Never commit secrets to code
❌ Never log secrets trong workflows
❌ Don't share secrets qua chat/email

Audit:
- Review secrets quarterly
- Remove unused secrets
- Update documentation
```

### 4. Monitoring & Alerts

```bash
Setup Notifications:
1. GitHub Settings > Notifications
2. Enable:
   - Actions (workflow failures)
   - Discussions (team updates)

3. Slack/Discord integration (optional):
   - Use GitHub Apps
   - Get workflow status in chat

4. Email alerts:
   - GitHub sends automatically
   - Configure in personal settings
```

---

## 📚 CHEATSHEET

### Quick Commands

```bash
# Chạy workflows locally (với act)
act push                         # Test push workflow
act pull_request                # Test PR workflow
act workflow_dispatch           # Test manual workflow

# GitHub CLI để trigger workflows
gh workflow run ci-cd.yml
gh workflow run database-migration.yml -f environment=staging -f action=deploy
gh workflow run deploy.yml

# View workflow runs
gh run list
gh run view <run-id>
gh run watch <run-id>

# Re-run failed workflows
gh run rerun <run-id>
```

### Environment Variables Priority

```bash
1. GitHub Secrets (highest priority)
   Được set trong workflow environment

2. .env.production (local build)
   Được đọc khi build production locally

3. .env (development)
   Được đọc trong development mode

Priority trong workflows:
Secrets > Environment Variables > Default Values
```

### Useful GitHub Actions URLs

```bash
Repository Actions:
https://github.com/{owner}/{repo}/actions

Specific Workflow:
https://github.com/{owner}/{repo}/actions/workflows/ci-cd.yml

Workflow Run:
https://github.com/{owner}/{repo}/actions/runs/{run-id}

Secrets Settings:
https://github.com/{owner}/{repo}/settings/secrets/actions
```

---

## 🎓 NEXT STEPS

### Immediate Actions

```bash
1. ✅ Push code to GitHub (if not yet)
2. ✅ Configure all required secrets
3. ✅ Test CI/CD pipeline:
   - Push to main
   - Check workflow runs
4. ✅ Test database migration:
   - Run on development first
   - Then staging
5. ✅ Setup deployment target (Vercel/Docker)
```

### Advanced Setup

```bash
1. Branch Protection Rules:
   Settings > Branches > Add rule
   - Require PR reviews
   - Require status checks (workflows)
   - Require up-to-date branches

2. Environments:
   Settings > Environments
   - Create: production, staging, development
   - Add protection rules
   - Add environment-specific secrets

3. Scheduled Workflows:
   - Add cron schedules
   - Automated backups
   - Nightly builds

4. Matrix Builds:
   - Test multiple Node versions
   - Test multiple databases
   - Cross-platform testing
```

---

## 📞 SUPPORT & RESOURCES

### Documentation Links

```bash
Dự án này:
- README.md - Tổng quan
- DEPLOYMENT.md - Deployment guide
- GITHUB_ACTIONS_GUIDE.md - Actions guide
- QUICK_START.md - Quick start

Official Docs:
- GitHub Actions: https://docs.github.com/actions
- Prisma: https://www.prisma.io/docs
- Next.js: https://nextjs.org/docs
- Docker: https://docs.docker.com
```

### Common Questions

**Q: Workflow chạy bao lâu?**
```bash
A: 
- CI/CD Pipeline: 3-5 phút
- Database Migration: 1-2 phút
- Production Deploy: 3-7 phút (tùy platform)
```

**Q: Có giới hạn số lần chạy không?**
```bash
A: GitHub Free plan:
- 2,000 minutes/month
- Unlimited for public repos
Pro plan:
- 3,000 minutes/month
```

**Q: Làm sao để debug workflows?**
```bash
A: 
1. View logs trong Actions tab
2. Enable debug logging:
   Settings > Secrets
   Add: ACTIONS_RUNNER_DEBUG = true
3. Add debug steps trong workflow
4. Test locally với act
```

---

## ✅ VERIFICATION CHECKLIST

Sau khi setup, check:

- [ ] All 3 workflows visible trong Actions tab
- [ ] All required secrets được thêm
- [ ] CI/CD pipeline chạy thành công ít nhất 1 lần
- [ ] Database migration test thành công
- [ ] Build artifacts được tạo
- [ ] Security scan pass
- [ ] Docker image build success (if applicable)
- [ ] Deployment target configured
- [ ] Health check endpoint working
- [ ] Documentation đọc và hiểu

---

**🎉 HỆ THỐNG CI/CD HOÀN CHỈNH VÀ SẴN SÀNG SỬ DỤNG!**

Version: 1.0.0
Last Updated: 2026-02-10
