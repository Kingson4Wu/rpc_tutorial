package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"

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

	// Set default endpoints based on environment
	if os.Getenv("ENV") == "docker" {
		// In docker environment, use container names as hostnames
		if *pythonServerEndpoint == "localhost:50051" {
			*pythonServerEndpoint = "python-server:50051"
		}
		if *javaServerEndpoint == "localhost:50052" {
			*javaServerEndpoint = "java-server:50052"
		}
	}

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
	
	// Add CORS middleware
	handler := corsMiddleware(mux)
	
	return http.ListenAndServe(":8080", handler)
}

// CORS middleware to handle preflight requests and add appropriate headers
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-grpc-web, x-user-agent, x-envoy-max-retries")

		// Handle preflight OPTIONS request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass through to next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	flag.Parse()
	if err := run(); err != nil {
		log.Fatalf("failed to run gateway: %v", err)
	}
}
