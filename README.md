# 🎡 LuckyRoom Backend

A real-time multiplayer wheel spinning game backend built with NestJS, featuring synchronized wheel spins, real-time chat, and WebSocket support.

## 📝 Description

LuckyRoom Backend is a comprehensive NestJS application that provides:

- 🎡 **Synchronized Wheel Spinning**: Real-time wheel spins with seed-based synchronization across all clients
- 🎯 **Weighted Probability System**: Customizable win rates for each wheel segment
- 💬 **Real-time Chat**: WebSocket-based chat system with emoji reactions
- 🏠 **Room Management**: Create and join rooms with role-based access (Host/Player/Spectator)
- 📊 **Spin History & Statistics**: Track all spin results with detailed analytics
- 🔐 **User Authentication**: JWT-based authentication with GraphQL API
- 🐳 **Docker Support**: Easy deployment with Docker Compose and MongoDB
- 🚀 **Production Ready**: Comprehensive error handling and logging

## 🛠️ Tech Stack

- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose
- **API**: GraphQL with Apollo Server
- **Real-time**: WebSocket (Socket.IO)
- **Authentication**: JWT with Passport
- **Package Manager**: pnpm
- **Validation**: class-validator & class-transformer
- **Logging**: Winston

## 📦 Project setup

```bash
# Install dependencies
pnpm install
```

## ⚙️ Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
# Application
PORT=20251
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/laos-app

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3001
```

## 🚀 Quick Start

### Option 1: Local Development

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Run the application
pnpm start:dev
```

The server will start at `http://localhost:20251`

- GraphQL Playground: `http://localhost:20251/graphql`
- WebSocket: `ws://localhost:20251`

### Option 2: Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

For more details:

- Quick Start Guide: [QUICKSTART.md](./QUICKSTART.md)
- Docker Guide: [DOCKER.md](./DOCKER.md)
- API Documentation: [API_GUIDE.md](./API_GUIDE.md)

## Compile and run the project

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## 🧪 Run tests

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## 🎓 How It Works

### Wheel Synchronization Algorithm

1. **Host triggers spin** → Backend receives request with wheelId
2. **Server generates seed** → Random seed (1 to 1e9)
3. **Weighted selection** → Calculate winner based on segment weights
4. **Broadcast to all** → Emit `spinResult` with seed + winner
5. **All clients animate** → Use same seed to ensure identical rotation
6. **Result appears** → All clients show same winner simultaneously

### Real-time Flow

```
Client A (Host)         Backend         Client B (Player)
    |                      |                    |
    |--- spin request ---->|                    |
    |                      |--- spinStarted --->|
    |<--- spinResult ------|                    |
    |                      |--- spinResult ---->|
    |                      |                    |
    |<--- (animate) ------>|<--- (animate) ---->|
    |                      |                    |
    |--- spinEnded ------->|                    |
    |                      |--- spinEnded ----->|
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing (if provided)
- ✅ WebSocket authentication via token
- ✅ Role-based access control
- ✅ Input validation with class-validator
- ✅ CORS configuration
- ✅ Environment variable protection

## 🚀 Deployment

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas or production database
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure logging
- [ ] Setup monitoring
- [ ] Enable rate limiting

### Docker Deployment

```bash
# Build image
docker build -t laosapp-backend .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

See [DOCKER.md](./DOCKER.md) for detailed instructions.

## 🎯 Features

### 🎡 Wheel Module

- Create custom spinning wheels with multiple segments
- Configure segment colors, text, and icons
- **Weighted probability system** - Set custom win rates for each segment
- **Seed-based synchronization** - All clients see identical spin results
- Real-time spin broadcasts via WebSocket
- Comprehensive spin history tracking

### 💬 Chat Module

- Real-time messaging via WebSocket namespaces
- Room-based conversations
- Emoji reactions (👍❤️😂🎉🔥👏)
- Message history with timestamps
- Participant presence tracking

### 🏠 Room Module

- Create and manage game rooms
- Unique room codes for easy joining
- Role-based access control:
  - **Host**: Can spin wheel, manage room
  - **Player**: Can participate and chat
  - **Spectator**: View-only mode
- Real-time participant updates
- Online/offline status tracking
- Public/private room options

### 👤 User Module

- User registration with nickname (email optional)
- JWT token-based authentication
- User profile management
- Persistent user sessions

### 📊 Spin History Module

- Track all spin results with timestamps
- Statistical analysis:
  - Total spins per room/wheel
  - Win rate per segment
  - Percentage distributions
- Historical data queries with filters
- Export capabilities (future)

## 🔌 API Endpoints

The application provides both GraphQL and WebSocket endpoints:

### GraphQL API

- **Endpoint**: `http://localhost:20251/graphql`
- **Playground**: Available in development mode
- **Authentication**: Bearer token in Authorization header

### WebSocket Namespaces

- **Room Events**: `ws://localhost:20251/room`
  - `joinRoom`, `leaveRoom`, `participantJoined`, `participantLeft`
- **Wheel Events**: `ws://localhost:20251/wheel`
  - `spin`, `spinStarted`, `spinResult`, `spinEnded`, `wheelUpdated`
- **Chat Events**: `ws://localhost:20251/chat`
  - `sendMessage`, `sendEmoji`, `newMessage`

### Key GraphQL Operations

```graphql
# User Registration
mutation {
  register(
    input: {
      email: "user@example.com"
      nickname: "Player1"
      password: "password123"
    }
  ) {
    user {
      _id
      nickname
    }
    accessToken
  }
}

# Create Room
mutation {
  createRoom(input: { name: "My Wheel Room", isPublic: true }) {
    _id
    code
    name
  }
}

# Join Room
mutation {
  joinRoom(input: { code: "ABC123", nickname: "Player1" }) {
    _id
    participants {
      nickname
      role
    }
  }
}

# Create Wheel
mutation {
  createWheel(
    input: {
      roomId: "room_id"
      title: "Lucky Wheel"
      segments: [
        { text: "Prize 1", color: "#FF0000", weight: 1, order: 0 }
        { text: "Prize 2", color: "#00FF00", weight: 2, order: 1 }
      ]
    }
  ) {
    _id
    segments {
      text
      weight
    }
  }
}
```

For complete API documentation, see [API_GUIDE.md](./API_GUIDE.md)

## Docker Deployment

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

For more details, see [DOCKER.md](./DOCKER.md)

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org)
- [Socket.IO Documentation](https://socket.io)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch from `develop`
3. Make your changes with clear commit messages
4. Write/update tests if needed
5. Submit a pull request to `develop`

### Commit Convention

```text
feat: add new feature
fix: bug fix
docs: documentation update
style: code style changes
refactor: code refactoring
test: add/update tests
chore: maintenance tasks
```

## 📝 License

This project is [MIT licensed](LICENSE).

## 👥 Team

Built with ❤️ for the LuckyRoom project

---

**Frontend Repository**: [LaosApp-FE](https://github.com/duonghoanh/LaosApp-FE)

**Version**: 1.0.0 | **Last Updated**: Oct 22, 2025

## 📁 Project Structure

```text
src/
├── common/                 # Shared modules
│   ├── decorators/        # Custom decorators (@CurrentUser)
│   ├── enums/             # Enums (RoomRole, etc.)
│   ├── guards/            # Auth guards (GQL, WebSocket)
│   └── interfaces/        # Shared interfaces
│
├── config/                 # Configuration
│   ├── database.config.ts # MongoDB connection
│   └── graphql.config.ts  # GraphQL setup
│
├── modules/               # Feature modules
│   ├── user/             # User & Authentication
│   │   ├── entities/     # User entity
│   │   ├── dto/          # Input/Output types
│   │   ├── resolvers/    # GraphQL resolvers
│   │   └── services/     # Business logic
│   │
│   ├── room/             # Room Management
│   │   ├── entities/     # Room entity
│   │   ├── dto/          # Room DTOs
│   │   ├── gateways/     # WebSocket gateway
│   │   ├── resolvers/    # GraphQL resolvers
│   │   └── services/     # Room logic
│   │
│   ├── wheel/            # Wheel System
│   │   ├── entities/     # Wheel entity
│   │   ├── dto/          # Wheel DTOs
│   │   ├── gateways/     # Spin events gateway
│   │   ├── resolvers/    # Wheel resolvers
│   │   └── services/     # Wheel & spin logic
│   │
│   ├── chat/             # Real-time Chat
│   │   ├── entities/     # Message entity
│   │   ├── dto/          # Message DTOs
│   │   ├── gateways/     # Chat gateway
│   │   ├── resolvers/    # Chat resolvers
│   │   └── services/     # Chat logic
│   │
│   └── spin-history/     # History & Statistics
│       ├── entities/     # SpinHistory entity
│       ├── dto/          # History DTOs
│       ├── resolvers/    # History resolvers
│       └── services/     # Statistics logic
│
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

## Contributing

1. Create a feature branch from `develop`
1. Make your changes
1. Submit a pull request to `develop`

## License

This project is [MIT licensed](LICENSE).
