package main

import (
	"context"
	"flag"
	"log"
	"net/http"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	gw "rpc-tutorial/gateway"
)

var (
	grpcServerEndpoint = flag.String("grpc-server-endpoint", "localhost:50051", "gRPC server endpoint")
)

func run() error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	mux := runtime.NewServeMux()
	opts := []grpc.DialOption{grpc.WithTransportCredentials(insecure.NewCredentials())}
	
	// Register Greeter service
	err := gw.RegisterGreeterHandlerFromEndpoint(ctx, mux, *grpcServerEndpoint, opts)
	if err != nil {
		return err
	}

	// Register Weather service
	err = gw.RegisterWeatherHandlerFromEndpoint(ctx, mux, *grpcServerEndpoint, opts)
	if err != nil {
		return err
	}

	log.Printf("grpc-gateway listening on :8080, forwarding to %s", *grpcServerEndpoint)
	return http.ListenAndServe(":8080", mux)
}

func main() {
	flag.Parse()
	if err := run(); err != nil {
		log.Fatalf("failed to run gateway: %v", err)
	}
}
