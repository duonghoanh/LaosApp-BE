# LaosApp Backend

A real-time interactive application backend built with NestJS, featuring wheel spin games, chat rooms, and WebSocket support.

## Description

LaosApp Backend is a comprehensive NestJS application that provides:

- 🎡 **Wheel Spin Game**: Create and manage spinning wheels with customizable prizes
- 💬 **Real-time Chat**: WebSocket-based chat system with room support
- 🏠 **Room Management**: Create and join rooms with role-based access (host/participant)
- 📊 **Spin History**: Track and analyze spin results with statistics
- 🔐 **User Authentication**: JWT-based authentication with GraphQL
- 🐳 **Docker Support**: Easy deployment with Docker and Docker Compose

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **API**: GraphQL with Apollo Server
- **Real-time**: WebSocket (Socket.IO)
- **Authentication**: JWT with Passport
- **Package Manager**: pnpm

## Project setup

```bash
pnpm install
```

## Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=laosapp
JWT_SECRET=your-secret-key
```

## Quick Start

For a complete quick start guide, see [QUICKSTART.md](./QUICKSTART.md)

For Docker deployment, see [DOCKER.md](./DOCKER.md)

For API documentation, see [API_GUIDE.md](./API_GUIDE.md)

## Compile and run the project

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Run tests

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Features

### 🎡 Wheel Module

- Create custom spinning wheels with prizes
- Configure prize probabilities
- Real-time spin results via WebSocket
- Spin history tracking

### 💬 Chat Module

- Real-time messaging via WebSocket
- Room-based conversations
- Emoji reactions
- Message history

### 🏠 Room Module

- Create and manage rooms
- Role-based access (host/participant)
- Real-time room updates
- Participant management

### 👤 User Module

- User registration and authentication
- JWT token-based security
- User profile management

### 📊 Spin History Module

- Track all spin results
- Statistical analysis
- Win rate calculations
- Historical data queries

## API Endpoints

The application provides both GraphQL and WebSocket endpoints:

- **GraphQL Playground**: `http://localhost:3000/graphql`
- **WebSocket**: `ws://localhost:3000`

For detailed API documentation, see [API_GUIDE.md](./API_GUIDE.md)

## Docker Deployment

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up
```

For more details, see [DOCKER.md](./DOCKER.md)

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [GraphQL Documentation](https://graphql.org)
- [Socket.IO Documentation](https://socket.io)
- [TypeORM Documentation](https://typeorm.io)

## Project Structure

```text
src/
├── common/          # Shared decorators, guards, and interfaces
├── config/          # Configuration files (database, GraphQL)
├── modules/         # Feature modules
│   ├── user/       # User management and authentication
│   ├── room/       # Room management
│   ├── chat/       # Real-time chat
│   ├── wheel/      # Wheel spin game
│   └── spin-history/ # Spin history tracking
└── main.ts         # Application entry point
```

## Contributing

1. Create a feature branch from `develop`
1. Make your changes
1. Submit a pull request to `develop`

## License

This project is [MIT licensed](LICENSE).
