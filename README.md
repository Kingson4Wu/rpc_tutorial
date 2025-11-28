# gRPC Microservices Architecture Demo

## 🎯 项目目的

*   **降低接口对接成本**: 通过 `.proto` IDL 文件定义接口，一键生成多语言客户端/服务端代码，消除前后端手动编写接口文档和解析代码的繁琐工作
*   **提高开发效率**: 自动生成类型安全的客户端和服务端代码，减少手动编写和维护的错误，节约大量对接时间
*   **多协议适配**: 通过 gRPC-Web 支持现代浏览器直接调用，通过 gRPC-Gateway 适配不支持 gRPC 的传统客户端，实现全协议覆盖
*   **演示真实微服务环境**: 展示服务间双向调用、多语言互操作、API 网关等真实场景

## ✨ 核心优势

*   **代码自动生成**: 从单一 .proto 文件生成 Python、Java、Go、JavaScript 等多语言代码
*   **类型安全**: 编译时检查确保前后端数据结构一致性，减少运行时错误
*   **高效传输**: gRPC 基于 HTTP/2，支持双向流、头部压缩等特性，传输效率远高于 REST/JSON
*   **跨语言互操作**: 不同语言服务间无缝通信，构建真正的多语言微服务架构

## 🚀 推荐使用模式

*   **现代前端应用**: 推荐使用 gRPC-Web 通过 Envoy 代理直接调用后端服务，享受类型安全和高效传输
*   **传统客户端**: 对于不支持 gRPC 的系统，通过 gRPC-Gateway 提供的 REST/JSON API 进行访问
*   **服务间通信**: 微服务内部使用原生 gRPC 进行通信，实现最佳性能

## ✅ 架构图

```
                                    +------------------+
                                    |                  |
        +-------------------------> |   Vue.js Client  |
        |                           | (Port 8082)      |
        |                           |                  |
  +-----+------+                    +------------------+
  |            |                         |
  |   User     |                         | (gRPC-Web or REST) - Vue client supports both
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
                            +-------------------------+     │
                                         ^                  │
                                         | (gRPC)           │
                            +-------------------------+     │
                            |                         |     │
                            |     Java gRPC Server    |  ---┘
                            |  (Greeter & Weather)    |
                            |       (Port 50052)      |
                            |                         |
                            +-------------------------+
                                          ^
                                          | (REST/JSON HTTP/1.1)
                                          |
        +-------------------------> +-------------+    gRPC-Gateway: REST Client → gRPC-Gateway → gRPC
        |                           |             |      (API Gateway pattern)  
        |                           |  REST API   |    (Port 8080)
        |                           |   Client    |
        +-------------------------> +-------------+

```
> **协议适配策略**: 
> - **Envoy Proxy** (端口 8081): 为浏览器提供 gRPC-Web 支持，实现现代前端直接调用 gRPC 服务
> - **gRPC-Gateway** (端口 8080): 将 gRPC 服务转换为 RESTful JSON API，适配传统客户端
> 
> Vue.js 客户端支持**双重协议**，用户可在界面上动态切换访问方式。


## 🚀 快速开始

### 两种运行方式

本项目支持两种运行方式，您可以根据自己的需求选择：

#### 1. 使用 Docker Compose (推荐)

**前提条件**:
*   [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)

**一键运行项目**:

在项目根目录执行以下命令：
```bash
docker-compose up --build
```

这将自动构建所有服务的 Docker 镜像并启动完整的微服务架构。

#### 2. 本地开发模式

**前提条件**:
* Python 3.7+
* Java 17+ & Maven 3.6+
* Go 1.22+
* Node.js 16+
* Envoy Proxy
* Protocol Buffers compiler (protoc) with plugins

**快速启动**:

使用提供的脚本一键启动所有服务：
```bash
# 使脚本可执行
chmod +x run_services.sh

# 启动所有服务
./run_services.sh local
```

或使用 Makefile (如果您的系统支持):
```bash
make local
```

### 访问和测试

*   **Vue.js 前端**:
    *   访问 `http://localhost:8082`
    *   在界面上选择 **"gRPC-Web via Envoy"** 或 **"REST/JSON via gRPC-Gateway"** 访问方式
    *   新增 **"Environment"** 选项，可以选择 **"Local"** 或 **"Container"** 以适应不同部署方式
    *   与 `Greeter` 和 `Weather` 服务进行交互
    *   点击 "Aggregate Hello" 按钮来测试双向的后端间调用 (Python ↔ Java)

*   **直接 REST/JSON API 测试**:
    *   gRPC-Gateway 服务在 `http://localhost:8080` 上可用
    *   测试 `Greeter` 服务:
        ```bash
        curl -X POST http://localhost:8080/v1/greeter/say_hello -H "Content-Type: application/json" -d '{"name": "JSON Client"}'
        ```
    *   测试 `AggregateHello` 服务:
        ```bash
        curl -X POST http://localhost:8080/v1/greeter/aggregate_hello -H "Content-Type: application/json" -d '{"name": "JSON Client"}'
        ```
    *   测试 `Weather` 服务:
        ```bash
        curl -X GET http://localhost:8080/v1/weather/Tokyo
        ```

*   **Envoy 管理界面**:
    *   访问 `http://localhost:9901` 查看 Envoy 的管理和统计信息

## 🛠️ 架构组件

### 1. Protocol Definition (`proto/services.proto`)

*   **统一契约**: 使用 `.proto` IDL 文件作为服务契约，实现接口标准化
*   **`Greeter` 服务**: 提供 `SayHello` (Unary), `SayHelloStream` (Server Streaming), `AggregateHello` (Bidirectional Backend Communication) 方法
*   **`Weather` 服务**: 提供 `GetWeather` 方法，演示复杂数据类型（枚举）处理
*   **HTTP 映射**: 通过 annotations 实现 gRPC 与 REST/JSON 自动映射，支持 gRPC-Gateway

### 2. Python gRPC Server (`python-server`)

*   **服务实现**: 完整实现 `Greeter` 和 `Weather` 服务接口
*   **服务间通信**: `AggregateHello` 方法实现服务发现和跨语言调用（Python → Java）
*   **代码生成**: 通过 `.proto` 文件自动生成客户端/服务端代码，实现类型安全保障

### 3. Java Spring Boot gRPC Server (`java-server`)

*   **服务实现**: 实现与 Python 服务相同的接口，展示多语言互操作性
*   **双向通信**: `AggregateHello` 方法支持反向调用（Java → Python），实现完整双向通信
*   **Spring Boot 集成**: 使用 Spring Boot 框架集成 gRPC 服务，简化部署和管理

### 4. Go gRPC-Gateway (`gateway`)

*   **API 网关**: 独立微服务，提供 gRPC → REST/JSON 转换能力
*   **协议适配**: 为不支持 gRPC 的客户端提供标准 RESTful API 接口
*   **自动映射**: 基于 `.proto` 文件的 HTTP annotations 自动映射 gRPC 方法到 REST 端点

### 5. Envoy Proxy (`envoy.yaml`)

*   **gRPC-Web 支持**: 为现代浏览器提供 gRPC-Web 代理功能
*   **协议转换**: 将 HTTP/1.1 gRPC-Web 请求转换为 HTTP/2 gRPC 请求
*   **多后端路由**: 支持基于服务名称的智能路由（Greeter服务→Python，Weather服务→Java）
*   **高性能**: 基于 Lyft Envoy 代理，提供高性能、可观察性、动态配置能力

### 6. Vue.js Client (`vue-client`)

*   **自动生成客户端**: 基于 `.proto` 文件生成类型安全的 JavaScript/TypeScript gRPC 客户端
*   **双重访问模式**: 同时支持 gRPC-Web（通过 Envoy）和 REST/JSON（通过 gRPC-Gateway）
*   **用户体验**: 提供直观的 UI 界面，用户可动态切换访问协议
*   **开发效率**: 消除手动 API 集成，通过代码生成实现快速开发

## 🚀 单独运行服务（本地开发模式）

### 前提条件

要单独运行服务，需要安装以下依赖：

* **Python 服务**：
  * Python 3.7+
  * pip
  * grpcio, grpcio-tools, and protobuf packages

* **Java 服务**：
  * Java 17+
  * Maven 3.6+

* **Go gRPC-Gateway**：
  * Go 1.22+
  * Protocol Buffers compiler (protoc)
  * Go gRPC and gRPC-Gateway plugins

* **Vue.js 客户端**：
  * Node.js 16+
  * npm or yarn

* **Envoy Proxy**：
  * Envoy Proxy (用于本地 gRPC-Web 支持)

* **通用**：
  * Protocol Buffers compiler (protoc)
  * Protobuf plugins: protoc-gen-go, protoc-gen-go-grpc, protoc-gen-grpc-gateway, protoc-gen-js, protoc-gen-grpc-web

### 使用便捷脚本运行（推荐）

项目提供了便捷脚本，可以一键启动所有本地服务：

```bash
# 使脚本可执行
chmod +x run_services.sh

# 启动所有本地服务
./run_services.sh local

# 停止所有本地服务
./run_services.sh stop-local
```

或者使用 Makefile（如果您的系统支持）：

```bash
# 使用 Make 启动所有本地服务
make local

# 停止所有本地服务
make clean
```

### 手动运行各个服务

#### Python gRPC Server

```bash
# 进入 Python 服务目录
cd python-server

# 创建并激活虚拟环境
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 运行服务（默认端口 50051）
python server.py
```

#### Java gRPC Server

```bash
# 进入 Java 服务目录
cd java-server

# 使用 Maven 运行（默认端口 50052）
./mvnw spring-boot:run

# 或者打包后运行
./mvnw clean package -DskipTests
java -jar target/java-server-0.0.1-SNAPSHOT.jar
```

#### Go gRPC-Gateway

```bash
# 进入 Gateway 目录
cd gateway

# 确保已安装 Go 依赖
go mod download

# 运行 Gateway（支持路由到多个后端服务，默认端口 8080）
# 默认路由：Greeter 服务到 Python，Weather 服务到 Java
go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052

# 或者自定义路由配置
go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50053
```

#### Envoy Proxy (本地环境)

对于本地开发，使用专门的 envoy-local.yaml 配置文件：

```bash
# 单独运行 Envoy 需要先安装 Envoy
# 运行本地 Envoy（默认端口 8081，支持多后端路由）
envoy -c envoy-local.yaml --base-id 1
```

#### Vue.js Client

```bash
# 进入 Vue 客户端目录
cd vue-client

# 安装依赖
npm install

# 开发模式运行（默认端口 8082）
npm run serve

# 或者构建后运行
npm run build
# 然后使用任意 HTTP 服务器提供服务，如：
npx serve -s dist
```

### 重新生成 Protobuf 代码

如果修改了 `proto/services.proto` 文件，需要重新生成所有语言的代码：

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

### 手动启动完整环境

按以下顺序启动服务：

1. 启动 Java 服务: `cd java-server && ./mvnw spring-boot:run`
2. 启动 Python 服务: `cd python-server && source venv/bin/activate && python server.py`
3. 启动 Go Gateway: `cd gateway && go run main.go --python-server-endpoint=localhost:50051 --java-server-endpoint=localhost:50052`
4. 启动本地 Envoy: `envoy -c envoy-local.yaml`
5. 启动 Vue client: `cd vue-client && npm run serve`

所有服务将通过 localhost 相互通信，访问地址与 Docker 配置相同：
* Vue.js Client: http://localhost:8082
* gRPC-Gateway: http://localhost:8080
* Envoy Proxy: http://localhost:8081
* Python Server: http://localhost:50051
* Java Server: http://localhost:50052

Envoy will route requests intelligently:
* Greeter service requests → Python server (localhost:50051)
* Weather service requests → Java server (localhost:50052)

### 配置说明

#### Envoy 配置

* `envoy.yaml` - 用于容器化环境，使用容器服务名称作为后端地址
* `envoy-local.yaml` - 用于本地开发环境，使用 localhost 作为后端地址

#### 环境变量

* 本地运行时 Python 服务默认连接到 `localhost:50052`
* Docker 运行时通过环境变量 `JAVA_SERVER_ADDRESS=java-server:50052` 指定 Java 服务地址
* Gateway 根据 `ENV=docker` 环境变量自动使用正确的后端地址