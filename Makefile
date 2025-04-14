.PHONY: deploy kill-port build serve

# Kill any process running on port 3000
kill-port:
	@echo "Killing process on port 3000..."
	@lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Build the client
build:
	@echo "Building client..."
	cd client && npm run build

# Serve the built files
serve:
	@echo "Starting server on port 3000..."
	cd client && serve dist -l 3000

# Main deploy command that runs everything
deploy: kill-port build serve

# Help command
help:
	@echo "Available commands:"
	@echo "  make deploy  - Kill existing process, rebuild, and serve on port 3000"
	@echo "  make build   - Only build the client"
	@echo "  make serve   - Only serve the client on port 3000" 