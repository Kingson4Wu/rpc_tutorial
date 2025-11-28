#!/bin/bash

set -e

# Script to run the RPC tutorial services locally or with Docker

case "$1" in
  "local")
    echo "Starting services locally..."
    echo "Starting Python server..."
    (cd python-server && python server.py) &
    sleep 2
    echo "Starting Java server..."
    (cd java-server && ./mvnw spring-boot:run) &
    sleep 5  # Wait for Java server to start
    echo "Starting gRPC gateway..."
    (cd gateway && go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052) &
    sleep 2
    echo "Starting Envoy proxy..."
    envoy -c envoy-local.yaml &
    sleep 2
    echo "Starting Vue client..."
    (cd vue-client && npm install && npm run serve) &
    echo "All services started. Press Ctrl+C to stop."
    wait
    ;;
  
  "docker")
    echo "Starting services with Docker Compose..."
    docker-compose up --build
    ;;
  
  "stop-local")
    echo "Stopping locally running services..."
    pkill -f "python server.py" || true
    pkill -f "mvnw spring-boot:run" || true
    pkill -f "go run main.go" || true
    pkill -f "envoy" || true
    pkill -f "npm run serve" || true
    echo "Local services stopped."
    ;;
  
  "stop-docker")
    echo "Stopping Docker Compose services..."
    docker-compose down
    ;;
  
  "stop-all")
    echo "Stopping all services (local and Docker)..."
    pkill -f "python server.py" || true
    pkill -f "mvnw spring-boot:run" || true
    pkill -f "go run main.go" || true
    pkill -f "envoy" || true
    pkill -f "npm run serve" || true
    docker-compose down || true
    echo "All services stopped."
    ;;
  
  *)
    echo "Usage: $0 {local|docker|stop-local|stop-docker|stop-all}"
    echo "  local      - Run all services locally (requires envoy proxy, Python, Java, Go, Node.js)"
    echo "  docker     - Run all services with Docker Compose"
    echo "  stop-local - Stop all locally running services"
    echo "  stop-docker - Stop all Docker Compose services"
    echo "  stop-all   - Stop all services (local and Docker)"
    exit 1
    ;;
esac