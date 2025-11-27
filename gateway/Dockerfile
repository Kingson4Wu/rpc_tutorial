FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /grpc-gateway main.go

FROM alpine:latest

WORKDIR /app

COPY --from=builder /grpc-gateway /grpc-gateway

EXPOSE 8080

CMD ["/grpc-gateway", "--python-server-endpoint", "python-server:50051", "--java-server-endpoint", "java-server:50052"]
