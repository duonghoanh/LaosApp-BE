# 🚀 Quick Start - LaosApp Backend

## Bước 1: Cài đặt

```bash
# Clone repo (nếu cần)
git clone <repo-url>
cd LaosApp-BE

# Cài dependencies
pnpm install

# Tạo file .env
cp .env.example .env
```

## Bước 2: Khởi động MongoDB

Chọn một trong các cách sau:

### Sử dụng Docker (Khuyến nghị)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Hoặc sử dụng MongoDB đã cài đặt

```bash
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

## Bước 3: Chạy server

```bash
# Development mode (auto-reload)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
```

Server sẽ chạy tại:

- 🌐 **GraphQL**: http://localhost:20251/graphql
- 🔌 **WebSocket**: ws://localhost:20251

## Bước 4: Test ứng dụng

### Cách 1: Dùng GraphQL Playground

Mở trình duyệt: http://localhost:20251/graphql

```graphql
# Đăng ký user
mutation {
  register(
    input: {
      email: "test@example.com"
      nickname: "TestUser"
      password: "123456"
    }
  ) {
    user {
      _id
      nickname
    }
    accessToken
  }
}

# Tạo phòng
mutation {
  createRoom(input: { name: "Test Room", isPublic: true }) {
    _id
    code
    name
  }
}
```

### Cách 2: Dùng Test Client HTML

Mở file: `test-client.html` trong trình duyệt

1. Click "Connect All Namespaces"
2. Nhập Room ID, User ID, Nickname
3. Click "Join Room"
4. Test các tính năng: Spin, Chat, etc.

### Cách 3: Dùng Postman/Insomnia

Import GraphQL endpoint: `http://localhost:20251/graphql`

## 🎡 Workflow Demo

### 1. Tạo tài khoản và phòng

```graphql
# Register
mutation {
  register(
    input: { email: "host@example.com", nickname: "Host", password: "123456" }
  ) {
    user {
      _id
    }
  }
}

# Create Room
mutation {
  createRoom(input: { name: "My Lucky Wheel", isPublic: true }) {
    _id
    code
  }
}
# Lưu lại roomId và code
```

### 2. Tạo bánh xe

```graphql
mutation {
  createWheel(
    input: {
      roomId: "YOUR_ROOM_ID"
      title: "Lucky Prizes"
      segments: [
        { text: "100$", color: "#FF0000", weight: 1, order: 0 }
        { text: "50$", color: "#00FF00", weight: 2, order: 1 }
        { text: "10$", color: "#0000FF", weight: 5, order: 2 }
        { text: "Try Again", color: "#FFFF00", weight: 10, order: 3 }
      ]
      spinDuration: 5000
    }
  ) {
    _id
  }
}
# Lưu lại wheelId
```

### 3. Join phòng và quay

```javascript
// Trong test-client.html hoặc code riêng
const socket = io('http://localhost:20251/wheel');

socket.on('connect', () => {
  // Quay bánh xe
  socket.emit('spin', {
    roomId: 'YOUR_ROOM_ID',
    wheelId: 'YOUR_WHEEL_ID',
    seed: 12345,
    spinnerNickname: 'Host',
  });
});

// Lắng nghe kết quả
socket.on('spinResult', (result) => {
  console.log('Winner:', result.winner.text);
});
```

### 4. Xem lịch sử và thống kê

```graphql
# Lịch sử
query {
  spinHistory(input: { roomId: "YOUR_ROOM_ID" }) {
    result
    spinnerNickname
    spunAt
  }
}

# Thống kê
query {
  roomStatistics(roomId: "YOUR_ROOM_ID") {
    totalSpins
    segmentStats {
      text
      count
      percentage
    }
  }
}
```

## 🔧 Troubleshooting

### Lỗi: Cannot connect to MongoDB

```bash
# Kiểm tra MongoDB đang chạy
docker ps | grep mongo
# hoặc
mongosh --eval "db.adminCommand('ping')"
```

### Lỗi: Port 20251 already in use

```bash
# Đổi port trong .env
PORT=3001
```

### Lỗi: Module not found

```bash
# Cài lại dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📊 Kiểm tra kết nối

```bash
# Test GraphQL
curl http://localhost:20251/graphql

# Test health (nếu có)
curl http://localhost:20251
```

## 🎯 Next Steps

1. ✅ Tạo user và phòng
2. ✅ Tạo bánh xe với segments
3. ✅ Connect WebSocket
4. ✅ Test spin realtime
5. ✅ Test chat
6. ✅ Xem thống kê

## 📚 Tài liệu thêm

- `API_GUIDE.md` - Chi tiết về API
- `IMPLEMENTATION.md` - Tổng quan implementation
- `README.md` - NestJS documentation

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra logs trong terminal
2. Kiểm tra MongoDB connection
3. Xem file IMPLEMENTATION.md
4. Kiểm tra browser console (F12)

---

**Happy Spinning! 🎡**
