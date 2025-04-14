# NHL Playoff Sheets

A web application for managing NHL playoff pools and predictions.

## Features

- User authentication (signup/signin)
- Admin dashboard for user management
- Under construction page for upcoming features
- More features coming soon!

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - TailwindCSS for styling
  - Framer Motion for animations
  - shadcn/ui for components

- Backend:
  - Go
  - Chi router
  - GORM with SQLite
  - JWT for authentication

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nhlplayoffsheets.com.git
cd nhlplayoffsheets.com
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd server
go mod download
```

4. Create environment files:

Frontend (.env in client directory):
```env
# For local development
VITE_API_URL=http://localhost:8080
# For production
# VITE_API_URL=https://api.nhlplayoffsheets.com
VITE_ADMIN_EMAIL=your.email@example.com
```

Backend (.env in server directory):
```env
PORT=8080
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=your.email@example.com
```

5. Run the development servers:
```bash
# In the root directory
make deploy
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:8080

## Production Deployment

### Frontend Deployment

1. Update the frontend environment variables:
```env
VITE_API_URL=https://api.nhlplayoffsheets.com  # Your public API URL
VITE_ADMIN_EMAIL=your.email@example.com
```

2. Build and deploy:
```bash
make build  # Builds the frontend
```

3. Serve the `client/dist` directory using your preferred hosting service (e.g., Netlify, Vercel, or your own server)

### Backend Deployment

1. Update the backend environment variables:
```env
PORT=8080
JWT_SECRET=your-secure-production-secret
ADMIN_EMAIL=your.email@example.com
```

2. Configure your domain:
   - Set up DNS records for your API domain (e.g., api.nhlplayoffsheets.com)
   - Configure SSL certificates for your domain
   - Update the CORS settings in `server/main.go` if using additional domains

3. Build and run the server:
```bash
make build-server
./server
```

4. For production hosting, consider:
   - Using a process manager (e.g., systemd, PM2)
   - Setting up a reverse proxy (e.g., Nginx)
   - Implementing proper logging
   - Setting up monitoring
   - Using a production-grade database

### Using Cloudflare Tunnel (Optional)

To expose your local server to the internet securely:

1. Install cloudflared
2. Configure a tunnel:
```bash
cloudflared tunnel create nhlplayoffsheets
```

3. Create a configuration file (config.yml):
```yaml
tunnel: your-tunnel-id
credentials-file: /path/to/credentials.json
ingress:
  - hostname: api.nhlplayoffsheets.com
    service: http://localhost:8080
  - service: http_status:404
```

4. Run the tunnel:
```bash
cloudflared tunnel run nhlplayoffsheets
```

5. Update your DNS records to point to the tunnel

## Local Development Commands

The application uses a Makefile for common tasks:

- `make deploy` - Builds and runs both frontend and server
- `make build` - Builds the frontend only
- `make build-server` - Builds the server only
- `make serve` - Serves the frontend only
- `make run-server` - Runs the server only

## Project Structure

```
.
├── client/             # Frontend React application
│   ├── src/
│   ├── public/
│   └── package.json
├── server/            # Backend Go application
│   ├── handlers/
│   ├── models/
│   └── main.go
├── Makefile          # Build and deployment scripts
└── README.md
```

## Environment Variables

### Frontend (client/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:8080 |
| VITE_ADMIN_EMAIL | Admin user email | - |

### Backend (server/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 8080 |
| JWT_SECRET | JWT signing secret | - |
| ADMIN_EMAIL | Admin user email | - |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.