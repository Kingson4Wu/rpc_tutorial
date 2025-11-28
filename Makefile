.PHONY: all local docker clean stop

# Default target
all: local

# Run all services locally
local: python-server java-server gateway envoy vue-client

# Start Python server
python-server:
	@echo "Starting Python gRPC server..."
	@cd python-server && python server.py &

# Start Java server
java-server:
	@echo "Starting Java gRPC server..."
	@cd java-server && ./mvnw spring-boot:run &

# Start gateway
gateway:
	@echo "Starting gRPC gateway..."
	@cd gateway && go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052 &

# Start envoy proxy for local development
envoy:
	@echo "Starting Envoy proxy for local development..."
	@envoy -c envoy-local.yaml &

# Start Vue client
vue-client:
	@echo "Starting Vue client..."
	@cd vue-client && npm install && npm run serve &

# Run with Docker Compose
docker:
	@echo "Starting services with Docker Compose..."
	docker-compose up --build

# Clean up local processes
clean:
	@echo "Stopping all local processes..."
	@pkill -f "python server.py" || true
	@pkill -f "mvnw spring-boot:run" || true
	@pkill -f "go run main.go" || true
	@pkill -f "envoy" || true
	@pkill -f "npm run serve" || true

# Stop docker compose
stop:
	@echo "Stopping Docker Compose services..."
	docker-compose down