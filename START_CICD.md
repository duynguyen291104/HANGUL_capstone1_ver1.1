# 🚀 BẮT ĐẦU VỚI CI/CD - 10 PHÚT

## ✅ CHECKLIST NHANH

### Bước 1: Xác Nhận Files Đã Có (2 phút)

Kiểm tra các file workflow đã được tạo:

```bash
ls -la .github/workflows/

# Bạn phải thấy:
✅ ci-cd.yml                    # Main CI/CD pipeline  
✅ database-migration.yml       # Database management
✅ deploy.yml                   # Production deployment
```

### Bước 2: Push Code Lên GitHub (3 phút)

```bash
# Nếu chưa có remote repository
git remote add origin https://github.com/YOUR_USERNAME/korean-topik-learning-app.git

# Add tất cả files
git add .

# Commit
git commit -m "feat: setup complete with CI/CD workflows"

# Push lên GitHub
git push -u origin main
```

**✨ SAU KHI PUSH:**
- GitHub Actions sẽ TỰ ĐỘNG chạy CI/CD Pipeline
- Vào repository > Tab "Actions" để xem

### Bước 3: Cấu Hình GitHub Secrets (5 phút)

**Vào GitHub Repository:**
1. Click tab **Settings**
2. Sidebar: **Secrets and variables** > **Actions**  
3. Click **New repository secret**

**Thêm MINIMUM 2 secrets này để bắt đầu:**

```bash
Secret 1:
Name: DEV_DATABASE_URL
Value: postgresql://topik_user:topik_password_2024@localhost:5432/topik_learning_db
(Hoặc database URL của bạn)

Secret 2:
Name: NEXTAUTH_SECRET
Value: [Tạo bằng lệnh: openssl rand -base64 32]
```

**Secrets cho Production (thêm sau khi có server):**

```bash
PRODUCTION_DATABASE_URL
STAGING_DATABASE_URL  
PRODUCTION_APP_URL
DOCKER_USERNAME (optional)
DOCKER_PASSWORD (optional)
VERCEL_TOKEN (optional)
```

---

## 🎯 TEST WORKFLOWS NGAY

### Test 1: CI/CD Pipeline

```bash
Method 1 - Tự động (đã chạy khi push):
✅ Vào Actions tab
✅ Xem workflow "CI/CD Pipeline" đang chạy
✅ Click vào để xem chi tiết

Method 2 - Manual:
1. Actions > CI/CD Pipeline
2. Click "Run workflow"
3. Branch: main
4. Click "Run workflow"
```

**Kết quả mong đợi (3-5 phút):**
```
✅ Lint & Code Quality - PASS
✅ Build & Test - PASS  
✅ Database Check - PASS
✅ Security Scan - PASS
✅ Docker Build - PASS
✅ Notification - PASS
```

### Test 2: Database Migration (Development)

```bash
1. Actions > Database Migration
2. Click "Run workflow"
3. Inputs:
   - Environment: development
   - Action: seed
4. Click "Run workflow"
```

**Kết quả (1-2 phút):**
```
✅ Migration deployed
   1,164 vocabulary items seeded
```

---

## 📊 XEM KỄT QUẢ

### Workflow đang chạy:

```
Tab Actions sẽ show:
┌─────────────────────────────────────┐
│ 🟡 CI/CD Pipeline                   │
│    Running... 2m 34s                │
│    ├─ ✅ Lint (completed)          │
│    ├─ 🟡 Build & Test (running)    │
│    └─ ⚪ Database Check (pending)  │
└─────────────────────────────────────┘
```

### Workflow thành công:

```
┌─────────────────────────────────────┐
│ ✅ CI/CD Pipeline                   │
│    Completed in 3m 45s              │
│    All checks passed!               │
└─────────────────────────────────────┘
```

### Workflow thất bại:

```
┌─────────────────────────────────────┐
│ ❌ CI/CD Pipeline                   │
│    Failed at Build & Test           │
│    Click to view logs →             │
└─────────────────────────────────────┘

Action: Click vào để xem lỗi ở step nào
```

---

## 🔥 WORKFLOWS SẴN SÀNG

Sau khi setup xong, bạn có:

### 1️⃣ CI/CD Pipeline (Tự động)
**Chạy khi:**
- ✅ Mỗi lần push code
- ✅ Mỗi lần tạo Pull Request
- ✅ Manual trigger

**Làm gì:**
- ✅ Kiểm tra code quality (ESLint, TypeScript)
- ✅ Build ứng dụng
- ✅ Test với database
- ✅ Scan security  
- ✅ Build Docker image

### 2️⃣ Database Migration (Manual)
**Chạy khi:**
- ✅ Manual trigger only

**Làm gì:**
- ✅ Deploy migrations
- ✅ Reset database
- ✅ Seed test data

**Sử dụng cho:**
- Development: Test migrations
- Staging: Deploy to staging DB
- Production: Deploy to prod DB

### 3️⃣ Production Deploy (Tự động/Manual)
**Chạy khi:**
- ✅ Push vào main branch
- ✅ Tạo version tag (v1.0.0)
- ✅ Manual trigger

**Làm gì:**
- ✅ Build production
- ✅ Run migrations
- ✅ Deploy to Vercel/Docker
- ✅ Health check

---

## 🎨 WORKFLOW DIAGRAM

```
YOUR CODE
   ↓
git push
   ↓
┌─────────────────────────┐
│   GITHUB REPOSITORY     │
│                         │
│  Triggers workflows ⚡  │
└─────────────────────────┘
   ↓
┌─────────────────────────────────────────┐
│        GITHUB ACTIONS                    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  1. CI/CD Pipeline             │    │
│  │     ✅ Lint                    │    │
│  │     ✅ Build & Test            │    │
│  │     ✅ Database Check          │    │
│  │     ✅ Security                │    │
│  │     ✅ Docker Build            │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  2. Database Migration         │    │
│  │     📊 Deploy/Reset/Seed       │    │
│  └────────────────────────────────┘    │
│                                          │
│  ┌────────────────────────────────┐    │
│  │  3. Production Deploy          │    │
│  │     🚀 Build → Deploy          │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
   ↓
DEPLOYMENT
```

---

## 📚 TÀI LIỆU CHI TIẾT

Sau khi test xong workflows cơ bản, đọc:

1. **[CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md)**
   - 📖 Hướng dẫn đầy đủ nhất (100+ trang)
   - Troubleshooting chi tiết
   - Best practices
   - Advanced configurations

2. **[GITHUB_ACTIONS_GUIDE.md](./GITHUB_ACTIONS_GUIDE.md)**
   - 🔧 Cấu hình secrets
   - Chạy workflows
   - Monitoring

3. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - 🚀 Deployment guide
   - Database setup
   - Production deployment

---

## ⚡ QUICK REFERENCE

### Xem Workflows
```bash
Tab: Actions
Filter: All workflows / By name / By status
```

### Chạy Manual Workflow
```bash
1. Actions tab
2. Chọn workflow từ sidebar
3. "Run workflow" button
4. Chọn inputs (nếu có)
5. "Run workflow"
```

### Xem Logs
```bash
1. Click vào workflow run
2. Click vào job name
3. Expand step để xem output
```

### Re-run Failed Workflow
```bash
1. Vào failed workflow run
2. Click "Re-run failed jobs"
Hoặc: "Re-run all jobs"
```

---

## 🐛 LỖI THƯỜNG GẶP

### ❌ "Authentication failed"
```bash
Nguyên nhân: Database URL secret sai
Fix: Check và update DATABASE_URL secret
```

### ❌ "Module not found"  
```bash
Nguyên nhân: Dependencies chưa install
Fix: Clear cache và re-run workflow
```

### ❌ "Migration failed"
```bash
Nguyên nhân: Schema conflict
Fix: Reset database hoặc fix migration
```

### ❌ "Build failed"
```bash
Nguyên nhân: TypeScript errors
Fix: Run npm run build locally để tìm lỗi
```

---

## ✅ SUCCESS INDICATORS

Bạn biết setup thành công khi:

- ✅ Actions tab hiện 3 workflows
- ✅ CI/CD Pipeline chạy xong với tất cả checkmarks xanh
- ✅ Build artifacts được tạo
- ✅ Không có lỗi trong logs
- ✅ Database migration test thành công
- ✅ Security scan pass

---

## 🎯 NEXT STEPS

1. ✅ Test tất cả 3 workflows ít nhất 1 lần
2. ✅ Fix lỗi nếu có (xem logs)
3. ✅ Setup production secrets khi ready
4. ✅ Configure deployment target (Vercel/Docker)
5. ✅ Enable branch protection rules
6. ✅ Setup notifications

---

## 📞 CẦN HELP?

**Xem logs chi tiết:**
- Actions > Click workflow run > Click job > Expand steps

**Documentation:**
- [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md) - Full guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment
- [README.md](./README.md) - Project overview

**Test locally:**
```bash
npm run build        # Test build
npm run db:migrate   # Test migrations
npm run lint         # Test lint
```

---

**🚀 BẠN ĐÃ SẴN SÀNG! PUSH CODE VÀ XEM WORKFLOWS CHẠY!**

Time to complete: ~10 minutes
Last updated: 2026-02-10
