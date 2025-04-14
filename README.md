# NHL Playoff Sheets

A modern playoff pool platform for NHL fans, built with Go, SQLite, and React.

## 🏒 Overview

NHL Playoff Sheets is a web application that lets hockey fans create and manage playoff pools. Track your picks, compete with friends, and follow the NHL playoffs in real-time.

## 🏗️ Tech Stack

### Backend (Go)
- **Framework**: Native Go HTTP server
- **Database**: SQLite with `database/sql`
- **NHL Data**: Integration with NHL's public API
- **Authentication**: JWT-based auth system
- **Environment**: Uses `.env` for configuration

### Frontend (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Fonts**: Inter via Fontsource

### Infrastructure
- **Hosting**: Cloudflare Tunnel for secure deployment
- **Database**: SQLite for simple, reliable data storage
- **Caching**: In-memory caching for NHL API responses
- **Development**: Hot-reloading for both Go and React

## 🚀 Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- SQLite 3
- ImageMagick (for asset generation)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nhlplayoffsheets.com.git
   cd nhlplayoffsheets.com
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

4. **Generate frontend assets**
   ```bash
   chmod +x scripts/generate-favicons.sh
   ./scripts/generate-favicons.sh
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Frontend
   cd client
   npm run dev

   # Terminal 2: Backend
   go run cmd/server/main.go
   ```

### Production Deployment

Use the Makefile commands for easy deployment:

```bash
make deploy  # Builds and serves the frontend
```

## 📁 Project Structure

```
.
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   └── scripts/           # Asset generation scripts
├── cmd/                   # Go command-line applications
│   └── server/           # Main server entry point
├── internal/              # Private Go packages
│   ├── api/              # API handlers
│   ├── db/               # Database operations
│   └── nhl/              # NHL API integration
├── migrations/            # SQLite database migrations
└── .env                  # Environment configuration
```

## 🔄 Data Flow

1. **NHL Data Integration**
   - Periodic polling of NHL's public API
   - Real-time game updates
   - Caching layer for API responses

2. **User Interactions**
   - JWT-based authentication
   - Real-time playoff bracket updates
   - Pool management and scoring

3. **Database Operations**
   - SQLite for persistent storage
   - Efficient querying for standings
   - Transaction support for data integrity

## 🛠️ Development Commands

```bash
# Frontend Development
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend Development
go run cmd/server/main.go  # Start Go server
go test ./...             # Run all tests

# Asset Generation
./client/scripts/generate-favicons.sh  # Generate favicon assets
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Production Site](https://nhlplayoffsheets.com)
- [NHL API Documentation](https://statsapi.web.nhl.com/api/v1/configurations)
- [Go Documentation](https://pkg.go.dev)