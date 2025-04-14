.PHONY: deploy kill-port build serve build-server run-server deploy-all set-prod-env set-dev-env deploy-test

# Kill any process running on ports 3000 and 8080 (for production/development)
kill-port:
	@echo "Killing processes on ports 3000 and 8080..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Kill any process running on ports 3001 and 8081 (for testing)
kill-port-test:
	@echo "Killing processes on test ports (3001 and 8081)..."
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8081 | xargs kill -9 2>/dev/null || true

# Set production environment
set-prod-env:
	@echo "Setting production environment..."
	@cp client/.env.production client/.env

# Set development environment
set-dev-env:
	@echo "Setting development environment..."
	@cp client/.env.development client/.env

# Build the client for production
build-prod:
	@echo "Building client for production..."
	cd client && NODE_ENV=production npm run build

# Build the client for development
build-dev:
	@echo "Building client for development..."
	cd client && NODE_ENV=development npm run build

# Build the server
build-server:
	@echo "Building server..."
	cd server && go build -o server main.go

# Run the server with logging
run-server:
	@echo "Starting server on port 8080..."
	cd server && ./server

# Deploy everything in separate terminals with development environment
deploy: kill-port set-dev-env build-dev build-server
	@echo "Starting deployment in development mode..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/server && PORT=8081 ./server"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/client && npm run dev"'
	@echo "Deployment complete. Server running on port 8081, client on port 3001"

# Deploy everything in separate terminals with test environment
deploy-test: kill-port-test set-dev-env build-dev build-server
	@echo "Starting test deployment..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/server && PORT=8081 ./server"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/client && npm run dev"'
	@echo "Test deployment complete. Server running on http://localhost:8081, client on http://localhost:3001"

# Deploy everything in separate terminals with production environment
deploy-prod: kill-port set-prod-env build-prod build-server
	@echo "Starting deployment in production mode..."
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/server && PORT=8080 ./server"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/client && serve dist -l 3000 --single"'
	@echo "Deployment complete. API running on port 8080, client on port 3000"

# Help command
help:
	@echo "Available commands:"
	@echo "  make deploy      - Deploy in development mode (API: localhost:8081, client: 3001)"
	@echo "  make deploy-test - Deploy in test mode (API: localhost:8081, client: 3001)"
	@echo "  make deploy-prod - Deploy in production mode (API: api.nhlplayoffsheets.com, client: 3000)"
	@echo "  make build-dev   - Build the client for development"
	@echo "  make build-prod  - Build the client for production"
	@echo "  make build-server - Build the server" 