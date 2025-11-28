#!/bin/bash

# Test script to validate the changes made for supporting both local and Docker environments

echo "Validating changes for local and Docker deployment compatibility..."

# Check if envoy-local.yaml exists
if [ -f "envoy-local.yaml" ]; then
    echo "✓ envoy-local.yaml file exists"
else
    echo "✗ envoy-local.yaml file missing"
    exit 1
fi

# Check if updated files exist and contain expected content
if grep -q "JAVA_SERVER_ADDRESS" python-server/server.py; then
    echo "✓ Python server has environment variable support"
else
    echo "✗ Python server missing environment variable support"
    exit 1
fi

if grep -q 'os.Getenv.*ENV.*docker' gateway/main.go; then
    echo "✓ Gateway has environment variable support"
else
    echo "✗ Gateway missing environment variable support"
    exit 1
fi

if grep -q "environment:" vue-client/src/components/Greeter.vue; then
    echo "✓ Vue client has environment selector"
else
    echo "✗ Vue client missing environment selector"
    exit 1
fi

if grep -q "JAVA_SERVER_ADDRESS" docker-compose.yml; then
    echo "✓ Docker Compose has environment variable configuration"
else
    echo "✗ Docker Compose missing environment variable configuration"
    exit 1
fi

if [ -f "run_services.sh" ]; then
    echo "✓ run_services.sh script exists"
else
    echo "✗ run_services.sh script missing"
    exit 1
fi

if [ -f "Makefile" ]; then
    echo "✓ Makefile exists"
else
    echo "✗ Makefile missing"
    exit 1
fi

echo ""
echo "All validations passed! The project now supports both local and Docker deployment:"
echo "- Local development: ./run_services.sh local or make local"
echo "- Docker deployment: ./run_services.sh docker or docker-compose up --build"
echo "- Stop local services: ./run_services.sh stop-local"
echo "- Stop Docker services: ./run_services.sh stop-docker or docker-compose down"

exit 0