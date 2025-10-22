# 🐳 Docker Deployment Guide

## Quick Start với Docker

### 1. Build và chạy toàn bộ stack

```bash
# Build và start tất cả services (MongoDB + App)
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop và xóa volumes (reset database)
docker-compose down -v
```

Ứng dụng sẽ chạy tại:

- **API**: http://localhost:20251/graphql
- **MongoDB**: localhost:27017

### 2. Development với Docker (chỉ MongoDB)

```bash
# Chỉ chạy MongoDB
docker-compose -f docker-compose.dev.yml up -d

# Chạy app locally
pnpm start:dev
```

### 3. Production Build

```bash
# Build Docker image
docker build -t laosapp-backend:latest .

# Run container
docker run -d \
  -p 20251:20251 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/laos-app \
  --name laosapp-backend \
  laosapp-backend:latest
```

## Environment Variables

Tạo file `.env` cho production:

```env
NODE_ENV=production
PORT=20251
MONGODB_URI=mongodb://mongodb:27017/laos-app
JWT_SECRET=your-production-secret-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

## Docker Commands

### Quản lý Containers

```bash
# List running containers
docker ps

# View logs
docker logs -f laosapp-backend

# Restart service
docker-compose restart app

# Exec vào container
docker exec -it laosapp-backend sh
```

### Quản lý Images

```bash
# List images
docker images

# Remove image
docker rmi laosapp-backend:latest

# Clean unused images
docker image prune -a
```

### Quản lý Volumes

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect laosapp-be_mongodb_data

# Remove volume (⚠️ xóa data!)
docker volume rm laosapp-be_mongodb_data
```

## MongoDB Management

### Kết nối MongoDB trong Docker

```bash
# Kết nối vào MongoDB container
docker exec -it laosapp-mongodb mongosh

# Trong mongosh:
use laos-app
db.users.find()
db.rooms.find()
```

### Backup Database

```bash
# Backup
docker exec laosapp-mongodb mongodump --db laos-app --out /dump

# Copy backup ra host
docker cp laosapp-mongodb:/dump ./backup

# Restore
docker cp ./backup laosapp-mongodb:/dump
docker exec laosapp-mongodb mongorestore /dump
```

## Multi-stage Build

Dockerfile sử dụng multi-stage build để tối ưu kích thước:

- **Stage 1 (builder)**: Install dependencies và build TypeScript
- **Stage 2 (production)**: Chỉ copy production dependencies và compiled code

Kết quả: Image nhỏ gọn, nhanh hơn.

## Health Checks

MongoDB container có health check tự động:

```yaml
healthcheck:
  test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
  interval: 10s
  timeout: 5s
  retries: 5
```

App chỉ start khi MongoDB đã sẵn sàng.

## Networking

Tất cả services trong cùng network `laosapp-network`:

- App connect MongoDB qua hostname: `mongodb://mongodb:27017`
- Host machine access qua: `mongodb://localhost:27017`

## Troubleshooting

### Container không start

```bash
# Check logs
docker-compose logs app

# Check container status
docker ps -a

# Remove và recreate
docker-compose down
docker-compose up -d --force-recreate
```

### MongoDB connection failed

```bash
# Check MongoDB health
docker exec laosapp-mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

### Port already in use

```bash
# Find process using port 20251
lsof -i :20251

# Change port in docker-compose.yml
ports:
  - "3001:20251"  # host:container
```

## Production Deployment

### Với Docker Swarm

```bash
docker stack deploy -c docker-compose.yml laosapp
```

### Với Kubernetes

```bash
# Convert docker-compose to k8s
kompose convert -f docker-compose.yml

# Deploy
kubectl apply -f .
```

### Scaling

```bash
# Scale app instances
docker-compose up -d --scale app=3
```

## Security Best Practices

1. **Đổi JWT_SECRET** trong production
2. **Sử dụng secrets** thay vì environment variables:

```yaml
secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

3. **Giới hạn MongoDB exposure**:

```yaml
# Không expose MongoDB ra ngoài
# mongodb:
#   ports:
#     - "27017:27017"  # Comment dòng này
```

4. **Sử dụng volumes cho persistent data**
5. **Regular backup database**

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/docker.yml
name: Docker Build

on:
  push:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker image
        run: docker build -t laosapp-backend .
      - name: Run tests
        run: docker run laosapp-backend pnpm test
```

## Monitoring

### View resource usage

```bash
docker stats
```

### Logs aggregation

```bash
# Follow logs from all services
docker-compose logs -f

# Only app logs
docker-compose logs -f app

# Last 100 lines
docker-compose logs --tail=100 app
```

---

**Tips**: Sử dụng `docker-compose.dev.yml` cho development và `docker-compose.yml` cho production!
