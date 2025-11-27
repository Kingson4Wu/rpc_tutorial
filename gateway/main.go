package main

import (
	"context"
	"flag"
	"log"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	pb "rpc-tutorial/gateway/pb"
)

var (
	// General flag for default backend
	grpcServerEndpoint = flag.String("grpc-server-endpoint", "localhost:50051", "Default gRPC server endpoint")
	
	// Specific service backend flags
	pythonServerEndpoint = flag.String("python-server-endpoint", "localhost:50051", "Python gRPC server endpoint")
	javaServerEndpoint   = flag.String("java-server-endpoint", "localhost:50052", "Java gRPC server endpoint")
)

func run() error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	
	// Register Greeter service with Python backend
	err := pb.RegisterGreeterHandlerFromEndpoint(ctx, mux, *pythonServerEndpoint, opts)
	if err != nil {
		return err
	}

	// Register Weather service with Java backend (as an example of routing to different backends)
	err = pb.RegisterWeatherHandlerFromEndpoint(ctx, mux, *javaServerEndpoint, opts)
	if err != nil {
		return err
	}

	log.Printf("grpc-gateway listening on :8080")
	log.Printf("  -> Greeter service routing to: %s", *pythonServerEndpoint)
	log.Printf("  -> Weather service routing to: %s", *javaServerEndpoint)
	
	return http.ListenAndServe(":8080", mux)
}

func main() {
	flag.Parse()
	if err := run(); err != nil {
		log.Fatalf("failed to run gateway: %v", err)
	}
}
