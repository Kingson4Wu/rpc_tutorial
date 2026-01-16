## 🎯 Project Purpose

*   **Reduce Interface Integration Cost**: Define interfaces through `.proto` IDL files, generate multi-language client/server code with one click, eliminating the tedious work of manually writing interface documents and parsing code between frontend and backend
*   **Improve Development Efficiency**: Automatically generate type-safe client and server code, reduce manual writing and maintenance errors, saving significant integration time
*   **Multi-protocol Adaptation**: Support direct calls from modern browsers through gRPC-Web, adapt traditional clients that don't support gRPC through gRPC-Gateway, achieving full protocol coverage
*   **Demonstrate Real Microservice Environment**: Showcase real-world scenarios such as bidirectional service calls, multi-language interoperability, API gateways, etc.

## ✨ Core Advantages

*   **Code Auto-generation**: Generate multi-language code for Python, Java, Go, JavaScript, etc. from a single .proto file
*   **Type Safety**: Compile-time checks ensure consistency of frontend and backend data structures, reducing runtime errors
*   **Efficient Transmission**: gRPC is based on HTTP/2, supporting bidirectional streaming, header compression, and other features, with transmission efficiency far exceeding REST/JSON
*   **Cross-language Interoperability**: Seamless communication between services in different languages, building a truly multi-language microservice architecture

## 🚀 Recommended Usage Patterns

*   **Modern Frontend Applications**: Recommended to use gRPC-Web to directly call backend services through Envoy proxy, enjoying type safety and efficient transmission
*   **Traditional Clients**: For systems that don't support gRPC, access through REST/JSON APIs provided by gRPC-Gateway
*   **Service-to-Service Communication**: Use native gRPC for communication within microservices to achieve optimal performance

## ✅ 架构图

```
                                    +------------------+
                                    |                  |
        +-------------------------> |   Vue.js Client  |
        |                           | (Port 8082)      |
        |                           |                  |
  +-----+------+                    +------------------+
  |            |                         |
  |   User     |                         | (gRPC-Web or REST)
  | (Browser)  |                         |
  +-----+------+                         v
        |                   +-------------------------+
        |                   |                         |
        +-----------------> |      Envoy Proxy        |  ←──┐
         (HTTP/1.1)         |     (Port 8081)         |     │ gRPC-Web: Browser → Envoy → gRPC
                            |  (gRPC-Web support)     |     │ (Protocol auto-conversion)
                            +------------+------------+     │
                                         | (gRPC)           │
                                         v                  │
                            +-------------------------+     │
                            |                         |     │
                            |    Python gRPC Server   |  ---+-- (Bidirectional gRPC communication)
                            | (Greeter & Weather)     |     │
                            |      (Port 50051)       |     │
                            |                         |     │
                            +------------+------------+     │
                                         ^                  │
                                         |(gRPC)            |
                                         v                  │
                            +------------+------------+     │
                            |                         |     │
                            |     Java gRPC Server    |  ---┘
                            |  (Greeter & Weather)    |
                            |       (Port 50052)      |
                            |                         |
                            +-------------------------+
                                          ^
                                          | (gRPC)
                                          |
                            +-------------------------+
                            |                         |
                            |   Go gRPC-Gateway       | ←──┘ gRPC → REST/JSON conversion
                            |    (Port 8080)          |    (API Gateway pattern)
                            | (gRPC → REST Gateway)   |
                            +------------+------------+
                                         |
                                         | (REST/JSON HTTP/1.1)
                                         v
                            +-------------------------+
                            |                         |
                            |   REST API Clients      |
                            |  (Any HTTP Client)      |
                            |                         |
                            +-------------------------+

```
> **Protocol Adaptation Strategy**: 
> - **Envoy Proxy** (port 8081): Provides gRPC-Web support for browsers, enabling modern frontends to directly call gRPC services
> - **Go gRPC-Gateway** (port 8080): Converts gRPC services to RESTful JSON APIs, adapting to traditional clients
> 
> The Vue.js client supports **dual protocols**, allowing users to dynamically switch between access methods via the UI.


## 🚀 Quick Start

### Two Running Methods

This project supports two running methods, you can choose according to your needs:

#### 1. Using Docker Compose (Recommended)

**Prerequisites**:
*   [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)

**One-click run the project**:

Execute the following command in the project root directory:
```bash
docker-compose up --build
```

This will automatically build Docker images for all services and start the complete microservice architecture.

#### 2. Local Development Mode

**Prerequisites**:
* Python 3.7+
* Java 17+ & Maven 3.6+
* Go 1.22+
* Node.js 16+
* Envoy Proxy
* Protocol Buffers compiler (protoc) with plugins

**Quick Start**:

Use the provided script to start all services with one click:
```bash
# Make the script executable
chmod +x run_services.sh

# Start all services
./run_services.sh local
```

Or use Makefile (if your system supports it):
```bash
make local
```

### Access and Testing

*   **Vue.js Frontend**:
    *   Visit `http://localhost:8082`
    *   Select **"gRPC-Web via Envoy"** or **"REST/JSON via gRPC-Gateway"** access method on the interface
    *   Interact with `Greeter` and `Weather` services
    *   Click the "Aggregate Hello" button to test bidirectional backend calls (Python ↔ Java)

*   **Direct REST/JSON API Testing**:
    *   gRPC-Gateway service is available at `http://localhost:8080`
    *   Test `Greeter` service:
        ```bash
        curl -X POST http://localhost:8080/v1/greeter/say_hello -H "Content-Type: application/json" -d '{"name": "JSON Client"}'
        ```
    *   Test `AggregateHello` service:
        ```bash
        curl -X POST http://localhost:8080/v1/greeter/aggregate_hello -H "Content-Type: application/json" -d '{"name": "JSON Client"}'
        ```
    *   Test `Weather` service:
        ```bash
        curl -X GET http://localhost:8080/v1/weather/Tokyo
        ```

*   **Envoy Management Interface**:
    *   Visit `http://localhost:9901` to view Envoy's management and statistics information

## 🛠️ Architecture Components

### 1. Protocol Definition (`proto/services.proto`)

*   **Unified Contract**: Use `.proto` IDL file as service contract to achieve interface standardization
*   **`Greeter` Service**: Provides `SayHello` (Unary), `SayHelloStream` (Server Streaming), `AggregateHello` (Bidirectional Backend Communication) methods
*   **`Weather` Service**: Provides `GetWeather` method, demonstrating complex data type (enumeration) processing
*   **HTTP Mapping**: Achieve automatic mapping between gRPC and REST/JSON through annotations, supporting gRPC-Gateway

### 2. Python gRPC Server (`python-server`)

*   **Service Implementation**: Fully implement `Greeter` and `Weather` service interfaces
*   **Inter-service Communication**: `AggregateHello` method implements service discovery and cross-language calls (Python → Java)
*   **Code Generation**: Automatically generate client/server code through `.proto` file, achieving type safety assurance

### 3. Java Spring Boot gRPC Server (`java-server`)

*   **Service Implementation**: Implement the same interfaces as Python service, showcasing multi-language interoperability
*   **Bidirectional Communication**: `AggregateHello` method supports reverse calls (Java → Python), achieving complete bidirectional communication
*   **Spring Boot Integration**: Use Spring Boot framework to integrate gRPC services, simplifying deployment and management

### 4. Go gRPC-Gateway (`gateway`)

*   **API Gateway**: Independent microservice providing gRPC → REST/JSON conversion capability
*   **Protocol Adaptation**: Provide standard RESTful API interfaces for clients that don't support gRPC
*   **Automatic Mapping**: Automatically map gRPC methods to REST endpoints based on HTTP annotations in `.proto` file

### 5. Envoy Proxy (`envoy.yaml`)

*   **gRPC-Web Support**: Provide gRPC-Web proxy functionality for modern browsers
*   **Protocol Conversion**: Convert HTTP/1.1 gRPC-Web requests to HTTP/2 gRPC requests
*   **Multi-backend Routing**: Support intelligent routing based on service names (Greeter service → Python, Weather service → Java)
*   **High Performance**: Based on Lyft Envoy proxy, providing high performance, observability, and dynamic configuration capabilities

### 6. Vue.js Client (`vue-client`)

*   **Auto-generated Client**: Generate type-safe JavaScript/TypeScript gRPC client based on `.proto` file
*   **Dual Access Mode**: Support both gRPC-Web (through Envoy) and REST/JSON (through gRPC-Gateway)
*   **User Experience**: Provide intuitive UI interface, allowing users to dynamically switch access protocols
*   **Development Efficiency**: Eliminate manual API integration, achieving rapid development through code generation

## 🚀 Running Services Separately (Local Development Mode)

### Prerequisites

To run services separately, you need to install the following dependencies:

* **Python Service**:
  * Python 3.7+
  * pip
  * grpcio, grpcio-tools, and protobuf packages

* **Java Service**:
  * Java 17+
  * Maven 3.6+

* **Go gRPC-Gateway**:
  * Go 1.22+
  * Protocol Buffers compiler (protoc)
  * Go gRPC and gRPC-Gateway plugins

* **Vue.js Client**:
  * Node.js 16+
  * npm or yarn

* **Envoy Proxy**:
  * Envoy Proxy (for local gRPC-Web support)

* **General**:
  * Protocol Buffers compiler (protoc)
  * Protobuf plugins: protoc-gen-go, protoc-gen-go-grpc, protoc-gen-grpc-gateway, protoc-gen-js, protoc-gen-grpc-web

### Running with Convenient Script (Recommended)

The project provides a convenient script that can start all local services with one click:

```bash
# Make the script executable
chmod +x run_services.sh

# Start all local services
./run_services.sh local

# Stop all local services
./run_services.sh stop-local
```

Or use Makefile (if your system supports it):

```bash
# Use Make to start all local services
make local

# Stop all local services
make clean
```

### Manually Running Individual Services

#### Python gRPC Server

```bash
# Enter Python service directory
cd python-server

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run service (default port 50051)
python server.py
```

#### Java gRPC Server

```bash
# Enter Java service directory
cd java-server

# Run with Maven (default port 50052)
./mvnw spring-boot:run

# Or package and run
./mvnw clean package -DskipTests
java -jar target/java-server-0.0.1-SNAPSHOT.jar
```

#### Go gRPC-Gateway

```bash
# Enter Gateway directory
cd gateway

# Ensure Go dependencies are installed
go mod download

# Run Gateway (supports routing to multiple backend services, default port 8080)
# Default routing: Greeter service to Python, Weather service to Java
go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052

# Or custom routing configuration
go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50053
```

#### Envoy Proxy (Local Environment)

For local development, use the dedicated envoy-local.yaml configuration file:

```bash
# Running Envoy separately requires installing Envoy first
# Run local Envoy (default port 8081, supports multi-backend routing)
envoy -c envoy-local.yaml --base-id 1
```

#### Vue.js Client

```bash
# Enter Vue client directory
cd vue-client

# Install dependencies
npm install

# Run in development mode (default port 8082)
npm run serve

# Or build and run
npm run build
# Then serve with any HTTP server, such as:
npx serve -s dist
```

### Regenerating Protobuf Code

If you modify the `proto/services.proto` file, you need to regenerate code for all languages:

```bash
# Python
python -m grpc_tools.protoc -I=./proto --python_out=./python-server --grpc_python_out=./python-server ./proto/services.proto

# Go (for gateway)
protoc -I=./proto --go_out=./gateway --go_opt=paths=source_relative --go-grpc_out=./gateway --go-grpc_opt=paths=source_relative --grpc-gateway_out=./gateway --grpc-gateway_opt=paths=source_relative ./proto/services.proto

# Java
protoc -I=./proto --java_out=./java-server/src/main/java --grpc-java_out=./java-server/src/main/java ./proto/services.proto

# JavaScript (for grpc-web)
protoc -I=./proto --js_out=import_style=commonjs,binary:./vue-client/src/generated --grpc-web_out=import_style=typescript,mode=grpcwebtext:./vue-client/src/generated ./proto/services.proto
```

### Manually Starting Complete Environment

Start services in the following order:

1. Start Java service: `cd java-server && ./mvnw spring-boot:run`
2. Start Python service: `cd python-server && source venv/bin/activate && python server.py`
3. Start Go Gateway: `cd gateway && go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052`
4. Start local Envoy: `envoy -c envoy-local.yaml`
5. Start Vue client: `cd vue-client && npm run serve`

All services will communicate with each other through localhost, with access addresses the same as Docker configuration:
* Vue.js Client: http://localhost:8082
* gRPC-Gateway: http://localhost:8080
* Envoy Proxy: http://localhost:8081
* Python Server: http://localhost:50051
* Java Server: http://localhost:50052

Envoy will route requests intelligently:
* Greeter service requests → Python server (localhost:50051)
* Weather service requests → Java server (localhost:50052)

### Configuration Notes

#### Envoy Configuration

* `envoy.yaml` - Used for containerized environments, using container service names as backend addresses (python-server:50051, java-server:50052)
* `envoy-local.yaml` - Used for local development environment, using localhost as backend addresses (127.0.0.1:50051, 127.0.0.1:50052)

#### Environment Variables

* Python service connects to `localhost:50052` by default when running locally
* Docker runtime specifies Java service address through environment variable `JAVA_SERVER_ADDRESS=java-server:50052`
* Gateway automatically uses correct backend address based on `ENV=docker` environment variable