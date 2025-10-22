# 🚀 Hướng Dẫn Cài Đặt Dự Án LuckyRoom - Chi Tiết Từng Bước

## 📋 Yêu Cầu Hệ Thống

### Phần mềm cần cài đặt:

- ✅ **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- ✅ **pnpm** >= 8.0.0 (Package manager)
- ✅ **MongoDB** >= 5.0 ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Git** ([Download](https://git-scm.com/))
- ✅ **VS Code** (Optional, recommended) ([Download](https://code.visualstudio.com/))

### Kiểm tra đã cài đặt:

```bash
node --version    # Nên >= v18.0.0
pnpm --version    # Nên >= 8.0.0
mongod --version  # Nên >= 5.0
git --version
```

---

## 📥 BƯỚC 1: Clone Repository

```bash
# Clone dự án
git clone https://github.com/duonghoanh/LaosApp-BE.git
git clone https://github.com/duonghoanh/LaosApp-FE.git

# Hoặc nếu đã có, update code mới nhất
cd LaosApp-BE
git checkout develop
git pull origin develop

cd ../LaosApp-FE
git checkout develop
git pull origin develop
```

---

## 🗄️ BƯỚC 2: Cài Đặt & Khởi Động MongoDB

### Option A: Cài đặt MongoDB Local (Recommended cho Development)

#### Trên macOS (Homebrew):

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### Trên Ubuntu/Debian:

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Trên Windows:

1. Download MongoDB Community Server từ [mongodb.com](https://www.mongodb.com/try/download/community)
2. Cài đặt với MongoDB Compass (GUI tool)
3. Start MongoDB service

### Kiểm tra MongoDB đang chạy:

```bash
# Test connection
mongosh
# Hoặc
mongo

# Nếu thành công, bạn sẽ thấy MongoDB shell
# Gõ 'exit' để thoát
```

### Option B: Sử dụng MongoDB Atlas (Cloud - Free Tier)

1. Truy cập [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo tài khoản miễn phí
3. Tạo Cluster mới (chọn Free Tier)
4. Trong Database Access, tạo user và password
5. Trong Network Access, thêm IP: `0.0.0.0/0` (cho development)
6. Click "Connect" → "Connect your application"
7. Copy connection string, nó sẽ có dạng:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/laos-app?retryWrites=true&w=majority
   ```

---

## 🔧 BƯỚC 3: Cài Đặt pnpm (nếu chưa có)

```bash
# Cài pnpm toàn cục
npm install -g pnpm

# Kiểm tra
pnpm --version
```

---

## 🎛️ BƯỚC 4: Setup Backend (LaosApp-BE)

### 4.1. Vào thư mục Backend

```bash
cd LaosApp-BE
```

### 4.2. Cài đặt dependencies

```bash
pnpm install
```

### 4.3. Tạo file .env

```bash
# Copy từ example
cp .env.example .env

# Hoặc tạo mới
touch .env
```

### 4.4. Cấu hình file .env

Mở file `.env` và điền thông tin:

```env
# ============================================
# APPLICATION SETTINGS
# ============================================
PORT=20251
NODE_ENV=development

# ============================================
# MONGODB CONFIGURATION
# ============================================
# Option A: MongoDB Local
MONGODB_URI=mongodb://localhost:27017/laos-app

# Option B: MongoDB Atlas (Nếu dùng cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/laos-app?retryWrites=true&w=majority

# ============================================
# JWT AUTHENTICATION
# ============================================
# ⚠️ QUAN TRỌNG: Đổi secret này trong production!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345678
JWT_EXPIRES_IN=7d

# ============================================
# CORS CONFIGURATION
# ============================================
# URL của Frontend (localhost cho development)
CORS_ORIGIN=http://localhost:3001

# Multiple origins (nếu cần):
# CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# ============================================
# WEBSOCKET SETTINGS (Optional)
# ============================================
WS_PORT=3001

# ============================================
# LOGGING (Optional)
# ============================================
LOG_LEVEL=debug
```

### 4.5. Tạo JWT Secret mạnh (Recommended)

```bash
# Tạo random secret key
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy output và paste vào JWT_SECRET trong .env
```

### 4.6. Khởi động Backend

```bash
# Development mode (hot reload)
pnpm start:dev

# Hoặc
pnpm run start:dev
```

### 4.7. Kiểm tra Backend đã chạy

Mở trình duyệt và truy cập:

✅ **GraphQL Playground**: http://localhost:20251/graphql

Bạn sẽ thấy giao diện GraphQL Playground

✅ **Health Check**: http://localhost:20251/

Nếu thấy lỗi kết nối MongoDB:

```bash
# Kiểm tra MongoDB service
sudo systemctl status mongod  # Linux
brew services list            # macOS

# Restart nếu cần
sudo systemctl restart mongod # Linux
brew services restart mongodb-community@7.0  # macOS
```

---

## 🎨 BƯỚC 5: Setup Frontend (LaosApp-FE)

### 5.1. Mở terminal mới, vào thư mục Frontend

```bash
cd ../LaosApp-FE
```

### 5.2. Cài đặt dependencies

```bash
pnpm install
```

### 5.3. Tạo file .env.local

```bash
# Copy từ example
cp .env.example .env.local

# Hoặc tạo mới
touch .env.local
```

### 5.4. Cấu hình file .env.local

Mở file `.env.local` và điền:

```env
# ============================================
# BACKEND API ENDPOINTS
# ============================================
# URL của Backend API
NEXT_PUBLIC_API_URL=http://localhost:20251

# GraphQL endpoint
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:20251/graphql

# WebSocket endpoint
NEXT_PUBLIC_WS_URL=ws://localhost:20251

# ============================================
# OPTIONAL SETTINGS
# ============================================
# NEXT_PUBLIC_APP_NAME=LuckyRoom
# NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 5.5. Khởi động Frontend

```bash
# Development mode
pnpm dev

# Frontend sẽ chạy tại port 3000 mặc định
```

### 5.6. Mở Frontend

Truy cập: **http://localhost:3000**

---

## ✅ BƯỚC 6: Kiểm Tra Toàn Bộ Hệ Thống

### 6.1. Kiểm tra các service đang chạy:

```bash
# Terminal 1: Backend
cd LaosApp-BE
pnpm start:dev
# ✅ Chạy tại: http://localhost:20251

# Terminal 2: Frontend
cd LaosApp-FE
pnpm dev
# ✅ Chạy tại: http://localhost:3000

# Terminal 3: MongoDB
mongosh
# ✅ MongoDB shell connect thành công
```

### 6.2. Test Flow Hoàn Chỉnh:

#### Bước 1: Tạo User

1. Mở http://localhost:3000
2. Click **"Create Room"**
3. Nhập nickname: `TestUser`
4. Click **"Join Now"**
5. ✅ Nếu thành công → Redirect đến trang create room

#### Bước 2: Tạo Room

1. Nhập room name: `Test Room`
2. Click **"Create Room"**
3. ✅ Nếu thành công → Redirect đến room page
4. **Lưu lại Room Code** (ví dụ: ABC123)

#### Bước 3: Join Room (Tab khác)

1. Mở tab mới/incognito: http://localhost:3000
2. Click **"Join Room"**
3. Nhập nickname: `Player2`
4. Nhập room code từ bước 2
5. Click **"Join Room"**
6. ✅ Kiểm tra cả 2 tabs thấy nhau trong Participants

#### Bước 4: Test Wheel

1. Tab 1 (Host) click **"SPIN THE WHEEL"**
2. ✅ Cả 2 tabs thấy wheel quay
3. ✅ Cả 2 tabs thấy cùng kết quả

#### Bước 5: Test Chat

1. Gửi message ở tab 1
2. ✅ Tab 2 nhận được ngay
3. Click emoji reactions
4. ✅ Tất cả tabs thấy emoji

---

## 🐛 Troubleshooting - Xử Lý Lỗi Thường Gặp

### ❌ Lỗi 1: "Cannot connect to MongoDB"

**Nguyên nhân**: MongoDB chưa chạy

**Giải pháp**:

```bash
# Check MongoDB status
sudo systemctl status mongod    # Linux
brew services list             # macOS

# Start MongoDB
sudo systemctl start mongod    # Linux
brew services start mongodb-community@7.0  # macOS

# Test connection
mongosh
```

### ❌ Lỗi 2: "Port 20251 already in use"

**Nguyên nhân**: Có process khác đang dùng port

**Giải pháp**:

```bash
# Tìm process đang dùng port
lsof -i :20251

# Kill process
kill -9 <PID>

# Hoặc đổi port trong .env
PORT=20252
```

### ❌ Lỗi 3: "Module not found" hoặc "Cannot find package"

**Nguyên nhân**: Dependencies chưa cài đúng

**Giải pháp**:

```bash
# Xóa node_modules và cài lại
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Hoặc
pnpm install --force
```

### ❌ Lỗi 4: "CORS Error" khi gọi API

**Nguyên nhân**: Backend chưa allow origin của Frontend

**Giải pháp**:

```bash
# Trong LaosApp-BE/.env
CORS_ORIGIN=http://localhost:3000

# Restart backend
```

### ❌ Lỗi 5: "WebSocket connection failed"

**Nguyên nhân**: WebSocket URL không đúng hoặc backend chưa chạy

**Giải pháp**:

```bash
# Check LaosApp-FE/.env.local
NEXT_PUBLIC_WS_URL=ws://localhost:20251

# Check backend logs
# Phải thấy: "WebSocket server listening..."
```

### ❌ Lỗi 6: "JWT malformed" hoặc "Unauthorized"

**Nguyên nhân**: Token không hợp lệ hoặc JWT_SECRET không khớp

**Giải pháp**:

```bash
# Clear localStorage trong browser
# F12 > Application > Local Storage > Clear

# Hoặc logout và login lại
```

### ❌ Lỗi 7: Frontend không load được

**Nguyên nhân**: Port 3000 bị chiếm

**Giải pháp**:

```bash
# Kill process trên port 3000
lsof -i :3000
kill -9 <PID>

# Hoặc run trên port khác
PORT=3001 pnpm dev
```

---

## 📊 Kiểm Tra Kết Nối

### Test MongoDB Connection

```bash
# Vào MongoDB shell
mongosh

# List databases
show dbs

# Switch to laos-app database
use laos-app

# Show collections
show collections

# Count users
db.users.countDocuments()
```

### Test Backend API với cURL

```bash
# Health check
curl http://localhost:20251/

# GraphQL query
curl -X POST http://localhost:20251/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}'
```

### Check Logs

```bash
# Backend logs
cd LaosApp-BE
tail -f logs/app.log

# Frontend logs
# Check terminal output
```

---

## 🐳 BONUS: Chạy Với Docker (Alternative)

Nếu muốn chạy toàn bộ với Docker:

### Backend

```bash
cd LaosApp-BE

# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

### Frontend

```bash
cd LaosApp-FE

# Build image
docker build -t laosapp-frontend .

# Run
docker run -p 3000:3000 laosapp-frontend
```

---

## 📚 Tài Liệu Tham Khảo

### Backend

- [API_GUIDE.md](./LaosApp-BE/API_GUIDE.md) - API documentation
- [QUICKSTART.md](./LaosApp-BE/QUICKSTART.md) - Quick start guide
- [DOCKER.md](./LaosApp-BE/DOCKER.md) - Docker deployment

### Frontend

- [FRONTEND_README.md](./LaosApp-FE/FRONTEND_README.md) - Architecture
- [DEPLOYMENT.md](./LaosApp-FE/DEPLOYMENT.md) - Deployment guide
- [QUICKSTART.md](./LaosApp-FE/QUICKSTART.md) - Quick start

---

## 🎯 Checklist Hoàn Thành

Đánh dấu ✅ khi hoàn thành:

- [ ] Cài đặt Node.js >= 18
- [ ] Cài đặt pnpm
- [ ] Cài đặt MongoDB và đang chạy
- [ ] Clone 2 repositories (BE & FE)
- [ ] Backend: Cài dependencies (`pnpm install`)
- [ ] Backend: Tạo và config `.env`
- [ ] Backend: Chạy thành công (`pnpm start:dev`)
- [ ] Backend: Truy cập được GraphQL Playground
- [ ] Frontend: Cài dependencies (`pnpm install`)
- [ ] Frontend: Tạo và config `.env.local`
- [ ] Frontend: Chạy thành công (`pnpm dev`)
- [ ] Frontend: Mở được http://localhost:3000
- [ ] Test: Tạo user thành công
- [ ] Test: Tạo room thành công
- [ ] Test: Join room thành công
- [ ] Test: Spin wheel đồng bộ
- [ ] Test: Chat realtime hoạt động

---

## 🆘 Cần Giúp Đỡ?

### Nếu gặp lỗi:

1. ✅ Check logs trong terminal
2. ✅ Check console trong browser (F12)
3. ✅ Check MongoDB đang chạy
4. ✅ Check các port không bị conflict
5. ✅ Clear cache & localStorage
6. ✅ Restart tất cả services

### Liên hệ:

- GitHub Issues: [Backend](https://github.com/duonghoanh/LaosApp-BE/issues) | [Frontend](https://github.com/duonghoanh/LaosApp-FE/issues)

---

**🎉 Chúc bạn setup thành công! Happy Coding!**
