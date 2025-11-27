# gRPC + grpc-gateway + Multi-language Demo 

这是一个功能增强版的 gRPC 跨语言微服务 Demo，展示了如何通过 .proto 协议文件一键生成多语言 RPC 代码，显著降低接口对接成本，提升开发效率。

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
        |                         | (Port 8082)      |
        |                         |                  |
  +-----+------+                  +------------------+
  |            |                         |
  |   User     |                         | (gRPC-Web or REST) - Vue client supports both
  | (Browser)  |                         |
  +-----+------+                         v
        |                   +-------------------------+
        |                   |                         |
        +-----------------> |      Envoy Proxy        |  ←──┐
         (HTTP/1.1)        |     (Port 8081)         |    │ gRPC-Web: Browser → Envoy → gRPC
                           |  (gRPC-Web support)     |    │ (Protocol auto-conversion)
                           +------------+------------+    │
                                        | (gRPC)         │
                                        v                │
                           +-------------------------+   │
                           |                         |   │
                           |    Python gRPC Server   | --+-- (Bidirectional gRPC communication)
                           | (Greeter & Weather)     |   │
                           |      (Port 50051)       |   │
                           |                         |   │
                           +-------------------------+   │
                                        ^                │
                                        | (gRPC)         │
                           +-------------------------+   │
                           |                         |   │
                           |     Java gRPC Server    | --┘
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


## 🚀 快速开始 (一键运行)

### 前提条件

确保您已安装：
*   [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)

> **注意**: 所有其他依赖（包括 Protobuf 编译器和插件）都已经通过 Docker 容器化，无需在本地安装。

### 一键运行项目

在项目根目录执行以下命令：

```bash
docker-compose up --build
```

这将自动构建所有服务的 Docker 镜像并启动完整的微服务架构。

### 访问和测试

*   **Vue.js 前端**:
    *   访问 `http://localhost:8082`
    *   在界面上选择 **"gRPC-Web via Envoy"** 或 **"REST/JSON via gRPC-Gateway"** 访问方式
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
*   **高性能**: 基于 Lyft Envoy 代理，提供高性能、可观察性、动态配置能力

### 6. Vue.js Client (`vue-client`)

*   **自动生成客户端**: 基于 `.proto` 文件生成类型安全的 JavaScript/TypeScript gRPC 客户端
*   **双重访问模式**: 同时支持 gRPC-Web（通过 Envoy）和 REST/JSON（通过 gRPC-Gateway）
*   **用户体验**: 提供直观的 UI 界面，用户可动态切换访问协议
*   **开发效率**: 消除手动 API 集成，通过代码生成实现快速开发