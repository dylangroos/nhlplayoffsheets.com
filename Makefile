.PHONY: deploy kill-port build serve build-server run-server deploy-all

# Kill any process running on ports 3000 and 8080
kill-port:
	@echo "Killing processes on ports 3000 and 8080..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true
	@lsof -ti:8080 | xargs kill -9 2>/dev/null || true

# Build the client
build:
	@echo "Building client..."
	cd client && npm run build

# Build the server
build-server:
	@echo "Building server..."
	cd server && go build -o server main.go

# Run the server with logging
run-server:
	@echo "Starting server on port 8080..."
	cd server && ./server

# Serve the client with logging
serve:
	@echo "Starting client on port 3000..."
	cd client && serve dist -l 3000

# Deploy everything in separate terminals
deploy:
	@echo "Starting deployment..."
	@$(MAKE) kill-port
	@$(MAKE) build
	@$(MAKE) build-server
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/server && ./server"'
	@osascript -e 'tell application "Terminal" to do script "cd $(PWD)/client && serve dist -l 3000"'
	@echo "Deployment complete. Check the new terminal windows for logs."

# Help command
help:
	@echo "Available commands:"
	@echo "  make deploy     - Kill existing processes, rebuild both client and server, and run them in separate terminals"
	@echo "  make build      - Only build the client"
	@echo "  make build-server - Build the server"
	@echo "  make serve      - Only serve the client on port 3000"
	@echo "  make run-server - Run the server on port 8080" 