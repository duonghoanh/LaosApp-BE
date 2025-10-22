# 🎡 LaosApp Backend - API Documentation

## Quick Start Guide

### Installation

```bash
pnpm install
cp .env.example .env
# Update .env with your MongoDB URI
pnpm start:dev
```

## 📡 GraphQL API Examples

### Authentication

```graphql
# Register
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
      email
      nickname
    }
    accessToken
  }
}
```

### Room Management

```graphql
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
      status
    }
  }
}
```

### Wheel Management

```graphql
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

## 🔌 WebSocket Events

### Room Events (`/room`)

```javascript
// Join room
socket.emit('joinRoom', {
  roomId: 'room_id',
  userId: 'user_id',
  nickname: 'Player1',
});

// Listen for participants
socket.on('participantJoined', (data) => {
  console.log(`${data.nickname} joined`);
});
```

### Wheel Events (`/wheel`)

```javascript
// Spin wheel
socket.emit('spin', {
  roomId: 'room_id',
  wheelId: 'wheel_id',
  seed: 12345,
  spinnerNickname: 'Player1',
});

// Listen for results
socket.on('spinResult', (result) => {
  console.log('Winner:', result.winner.text);
});
```

### Chat Events (`/chat`)

```javascript
// Send message
socket.emit('sendMessage', {
  roomId: 'room_id',
  content: 'Hello!',
  nickname: 'Player1',
});

// Listen for messages
socket.on('newMessage', (msg) => {
  console.log(`${msg.nickname}: ${msg.content}`);
});
```

## 🎯 Features

- ✅ Realtime wheel spinning synchronized across all clients
- ✅ Weighted probability for custom win rates
- ✅ Room management with roles (Host/Player/Spectator)
- ✅ Chat system with emoji reactions
- ✅ Spin history and statistics
- ✅ Public/Private rooms with passwords

## 📊 Access Points

- GraphQL Playground: http://localhost:20251/graphql
- WebSocket: ws://localhost:20251

## 🔧 Environment Variables

```env
PORT=20251
MONGODB_URI=mongodb://localhost:27017/laos-app
CORS_ORIGIN=http://localhost:3001
JWT_SECRET=your-secret-key
```
