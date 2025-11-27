FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /grpc-gateway main.go

FROM alpine/git:latest

WORKDIR /app

COPY --from=builder /grpc-gateway .

EXPOSE 8080

CMD ["/app/grpc-gateway", "--python-server-endpoint", "python-server:50051", "--java-server-endpoint", "java-server:50052"]
